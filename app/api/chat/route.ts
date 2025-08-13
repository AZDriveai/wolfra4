import type { NextRequest } from "next/server"
import { streamText, type CoreMessage } from "ai"
import { researcher } from "@/lib/researchers/researcher"
import { manualResearcher } from "@/lib/researchers/manual-researcher"
import { generateRelatedQuestions } from "@/lib/actions/generate-related-questions"

export async function POST(request: NextRequest) {
  try {
    const {
      message,
      sessionId,
      searchMode = false,
      model = "groq:llama-3.1-70b-versatile",
      messages = [],
    } = await request.json()

    if (!message || typeof message !== "string") {
      return new Response("رسالة غير صالحة", { status: 400 })
    }

    // Build conversation history
    const conversationMessages: CoreMessage[] = [
      ...messages,
      {
        role: "user" as const,
        content: message,
      },
    ]

    // Choose researcher based on search mode
    const researcherConfig = searchMode
      ? researcher({
          messages: conversationMessages,
          model,
          searchMode: true,
        })
      : manualResearcher({
          messages: conversationMessages,
          model,
          isSearchEnabled: false,
        })

    // Create streaming response
    const result = streamText(researcherConfig)

    // Create a custom stream that includes additional data
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Stream the main response
          for await (const chunk of result.textStream) {
            const data = JSON.stringify({ type: "text", content: chunk })
            controller.enqueue(encoder.encode(`data: ${data}\n\n`))
          }

          // Get the final text for related questions
          const finalText = await result.text

          // Generate related questions if search mode is enabled
          if (searchMode && finalText) {
            try {
              const relatedResult = await generateRelatedQuestions(conversationMessages, model)
              const relatedQuestions = relatedResult.object.items.map((item) => item.query)

              const relatedData = JSON.stringify({
                type: "related",
                questions: relatedQuestions,
              })
              controller.enqueue(encoder.encode(`data: ${relatedData}\n\n`))
            } catch (error) {
              console.error("Error generating related questions:", error)
            }
          }

          controller.close()
        } catch (error) {
          console.error("Streaming error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("Chat API Error:", error)
    return new Response("حدث خطأ في معالجة الرسالة", { status: 500 })
  }
}
