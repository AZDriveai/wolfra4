export interface Model {
  id: string
  name: string
  provider: string
  providerId: string
  enabled: boolean
  toolCallType: "native" | "manual"
  toolCallModel?: string
}

export interface Chat {
  id: string
  title: string
  createdAt: Date
  userId: string
  path: string
  messages: any[]
  sharePath?: string
}
