import { tool } from "ai"
import { getQuestionSchemaForModel } from "@/lib/schemas/question"

export function createQuestionTool(model: string) {
  const schema = getQuestionSchemaForModel(model)

  return tool({
    description: "Ask a clarifying question to better understand the user's request",
    parameters: schema,
    execute: async ({ question, options, allowsInput, inputLabel, inputPlaceholder }) => {
      return {
        type: "question",
        question,
        options,
        allowsInput,
        inputLabel,
        inputPlaceholder,
      }
    },
  })
}
