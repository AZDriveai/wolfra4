import { tool } from "ai"
import { retrieveSchema } from "@/lib/schemas/retrieve"

export const retrieveTool = tool({
  description: "Retrieve content from a specific URL",
  parameters: retrieveSchema,
  execute: async ({ url }) => {
    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": "Wolf AI Bot/1.0",
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const content = await response.text()
      return {
        type: "retrieved_content",
        url,
        content: content.slice(0, 10000), // Limit content size
        title: extractTitle(content),
      }
    } catch (error) {
      console.error("Retrieve error:", error)
      return {
        type: "error",
        message: `Failed to retrieve content from ${url}`,
        url,
      }
    }
  },
})

function extractTitle(html: string): string {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return titleMatch ? titleMatch[1].trim() : "Untitled"
}
