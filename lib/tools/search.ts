import { tool } from "ai"
import { getSearchSchemaForModel } from "@/lib/schemas/search"

export function createSearchTool(model: string) {
  const schema = getSearchSchemaForModel(model)

  return tool({
    description: "Search the web for information on a given topic",
    parameters: schema,
    execute: async ({ query, max_results = 20, search_depth = "basic", include_domains, exclude_domains }) => {
      try {
        // Use Upstash Search integration for web search
        const searchUrl = process.env.UPSTASH_SEARCH_REST_URL
        const searchToken = process.env.UPSTASH_SEARCH_REST_TOKEN

        if (!searchUrl || !searchToken) {
          throw new Error("Upstash Search configuration missing")
        }

        const response = await fetch(`${searchUrl}/search`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${searchToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query,
            limit: max_results,
            depth: search_depth,
            include_domains,
            exclude_domains,
          }),
        })

        if (!response.ok) {
          throw new Error(`Search API error: ${response.status}`)
        }

        const results = await response.json()
        return {
          type: "search_results",
          results: results.results || [],
          query,
        }
      } catch (error) {
        console.error("Search error:", error)
        return {
          type: "error",
          message: "Search functionality temporarily unavailable",
          query,
        }
      }
    },
  })
}
