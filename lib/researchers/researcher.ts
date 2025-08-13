import type { CoreMessage, streamText } from "ai"
import { createQuestionTool } from "@/lib/tools/question"
import { retrieveTool } from "@/lib/tools/retrieve"
import { createSearchTool } from "@/lib/tools/search"
import { getModel } from "@/lib/utils/registry"

const SYSTEM_PROMPT = `
Instructions:

You are a helpful AI assistant with access to real-time web search, content retrieval, and the ability to ask clarifying questions.

When asked a question, you should:
1. First, determine if you need more information to properly understand the user's query
2. **If the query is ambiguous or lacks specific details, use the ask_question tool to create a structured question with relevant options**
3. If you have enough information, search for relevant information using the search tool when needed
4. Use the retrieve tool to get detailed content from specific URLs
5. Analyze all search results to provide accurate, up-to-date information
6. Always cite sources using the [number](url) format, matching the order of search results. If multiple sources are relevant, include all of them, and comma separate them. Only use information that has a URL available for citation.
7. If results are not relevant or helpful, rely on your general knowledge
8. Provide comprehensive and detailed responses based on search results, ensuring thorough coverage of the user's question
9. Use markdown to structure your responses. Use headings to break up the content into sections.
10. **Use the retrieve tool only with user-provided URLs.**

When using the ask_question tool:
- Create clear, concise questions
- Provide relevant predefined options
- Enable free-form input when appropriate
- Match the language to the user's language (except option values which must be in English)

Citation Format:
[number](url)
`

type ResearcherReturn = Parameters<typeof streamText>[0]

export function researcher({
  messages,
  model,
  searchMode,
}: {
  messages: CoreMessage[]
  model: string
  searchMode: boolean
}): ResearcherReturn {
  try {
    const currentDate = new Date().toLocaleString()

    // Create model-specific tools
    const searchTool = createSearchTool(model)
    const askQuestionTool = createQuestionTool(model)

    return {
      model: getModel(model),
      system: `${SYSTEM_PROMPT}\nCurrent date and time: ${currentDate}`,
      messages,
      tools: {
        search: searchTool,
        retrieve: retrieveTool,
        ask_question: askQuestionTool,
      },
      activeTools: searchMode ? ["search", "retrieve", "ask_question"] : [],
      maxSteps: searchMode ? 5 : 1,
    }
  } catch (error) {
    console.error("Error in researcher:", error)
    throw error
  }
}
