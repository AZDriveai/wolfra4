import { openai } from "@ai-sdk/openai"
import { groq } from "@ai-sdk/groq"
import { createOpenAI } from "@ai-sdk/openai"
import type { Model } from "@/lib/types/models"
import { getModels } from "@/lib/config/models"

// Create provider instances
const huggingface = createOpenAI({
  apiKey: process.env.HF_API_KEY,
  baseURL: "https://api-inference.huggingface.co/v1/",
})

const deepseek = createOpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1",
})

const together = createOpenAI({
  apiKey: process.env.TOGETHER_API_KEY,
  baseURL: "https://api.together.xyz/v1",
})

export function getModel(modelId: string) {
  // Handle provider:model format
  const [provider, model] = modelId.includes(":") ? modelId.split(":") : [null, modelId]

  // Map providers to their SDK instances
  switch (provider || getProviderFromModelId(modelId)) {
    case "openai":
      return openai(model || modelId)
    case "groq":
      return groq(model || modelId)
    case "huggingface":
      return huggingface(model || modelId)
    case "deepseek":
      return deepseek(model || modelId)
    case "together":
      return together(model || modelId)
    default:
      // Default to Groq for unknown providers
      return groq("llama-3.1-70b-versatile")
  }
}

export function getToolCallModel(modelId: string) {
  // For models that don't support tool calling natively,
  // fall back to a model that does
  return getModel("groq:llama-3.1-70b-versatile")
}

export function isToolCallSupported(modelId: string): boolean {
  const [provider] = modelId.includes(":") ? modelId.split(":") : [getProviderFromModelId(modelId)]

  // Most modern models support tool calling
  const supportedProviders = ["openai", "groq", "together"]
  return supportedProviders.includes(provider)
}

function getProviderFromModelId(modelId: string): string {
  // Infer provider from model ID patterns
  if (modelId.includes("gpt") || modelId.includes("openai")) return "openai"
  if (modelId.includes("llama") || modelId.includes("meta-llama")) return "together"
  if (modelId.includes("deepseek")) return "deepseek"
  if (modelId.includes("qwen")) return "groq"
  return "groq" // Default fallback
}

export async function getAvailableModels(): Promise<Model[]> {
  try {
    return await getModels()
  } catch (error) {
    console.error("Error fetching models:", error)
    return []
  }
}
