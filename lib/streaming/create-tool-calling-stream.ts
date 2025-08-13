import { type CoreMessage, streamText } from "ai"
import { getModel } from "@/lib/utils/registry"

interface ToolCallingStreamConfig {
  messages: CoreMessage[]
  model: string
  tools?: Record<string, any>
  systemPrompt?: string
  maxSteps?: number
}

export function createToolCallingStream({
  messages,
  model,
  tools = {},
  systemPrompt = "You are a helpful AI assistant.",
  maxSteps = 5,
}: ToolCallingStreamConfig) {
  return streamText({
    model: getModel(model),
    system: systemPrompt,
    messages,
    tools,
    maxSteps,
    experimental_activeTools: Object.keys(tools),
  })
}
