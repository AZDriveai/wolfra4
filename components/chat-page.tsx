"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import {
  Send,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Globe,
  MessageSquare,
  Telescope,
  Clock,
  Edit2,
  RotateCcw,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: Array<{ title: string; url: string }>
  relatedQuestions?: string[]
}

// Define section structure for better organization
interface ChatSection {
  id: string // User message ID
  userMessage: Message
  assistantMessages: Message[]
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [searchMode, setSearchMode] = useState(false)
  const [selectedModel, setSelectedModel] = useState("qwen/qwen3-32b")
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null)
  const [editingContent, setEditingContent] = useState("")

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const availableModels = [
    { id: "openai/gpt-oss-120b", name: "GPT OSS 120B", provider: "Hugging Face" },
    { id: "deepseek-reasone", name: "DeepSeek Reasoner", provider: "DeepSeek" },
    { id: "Alibaba-NLP/gte-modernbert-base", name: "ModernBERT Base", provider: "Together AI" },
    { id: "qwen/qwen3-32b", name: "Qwen 3 32B", provider: "Groq" },
  ]

  // Convert messages array to sections array for better organization
  const sections = useMemo<ChatSection[]>(() => {
    const result: ChatSection[] = []
    let currentSection: ChatSection | null = null

    for (const message of messages) {
      if (message.role === "user") {
        // Start a new section when a user message is found
        if (currentSection) {
          result.push(currentSection)
        }
        currentSection = {
          id: message.id,
          userMessage: message,
          assistantMessages: [],
        }
      } else if (currentSection && message.role === "assistant") {
        // Add assistant message to the current section
        currentSection.assistantMessages.push(message)
      }
    }

    // Add the last section if exists
    if (currentSection) {
      result.push(currentSection)
    }

    return result
  }, [messages])

  // Detect if scroll container is at the bottom
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const threshold = 50 // threshold in pixels
      if (scrollHeight - scrollTop - clientHeight < threshold) {
        setIsAtBottom(true)
      } else {
        setIsAtBottom(false)
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Set initial state

    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to the section when a new user message is sent
  useEffect(() => {
    if (sections.length > 0) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage && lastMessage.role === "user") {
        // If the last message is from user, find the corresponding section
        const sectionId = lastMessage.id
        requestAnimationFrame(() => {
          const sectionElement = document.getElementById(`section-${sectionId}`)
          sectionElement?.scrollIntoView({ behavior: "smooth", block: "start" })
        })
      }
    }
  }, [sections, messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const activateR1Mode = async () => {
    setSelectedModel("deepseek-reasone") // Switch to DeepSeek for R1 mode

    const systemMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "🤖 تم تفعيل وضع R1 المتقدم! أنا الآن مساعد ذكي ومتقدم مع قدرات التفكير المرئي المتقدم. سأتبع تسلسل التفكير المنهجي وأقدم تحليلاً عميقاً لجميع استفساراتك.",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, systemMessage])
  }

  const activateSearchMode = () => {
    setSearchMode(true)
    const searchMessage: Message = {
      id: Date.now().toString(),
      role: "assistant",
      content:
        "🌐 تم تفعيل وضع البحث المتقدم! يمكنني الآن البحث في الإنترنت والحصول على أحدث المعلومات من مصادر متنوعة لتقديم إجابات شاملة ومحدثة.",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, searchMessage])
  }

  const sendMessage = async (messageContent: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageContent,
          sessionId: sessionId,
          searchMode: searchMode,
          model: selectedModel,
          messages: messages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error("فشل في إرسال الرسالة")
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "",
        timestamp: new Date(),
        sources: [],
        relatedQuestions: [],
      }

      setMessages((prev) => [...prev, assistantMessage])

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              try {
                const data = JSON.parse(line.slice(6))

                if (data.type === "text") {
                  assistantMessage.content += data.content
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id ? { ...msg, content: assistantMessage.content } : msg,
                    ),
                  )
                } else if (data.type === "sources") {
                  assistantMessage.sources = data.sources
                  setMessages((prev) =>
                    prev.map((msg) => (msg.id === assistantMessage.id ? { ...msg, sources: data.sources } : msg)),
                  )
                } else if (data.type === "related") {
                  assistantMessage.relatedQuestions = data.questions
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMessage.id ? { ...msg, relatedQuestions: data.questions } : msg,
                    ),
                  )
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "عذراً، حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const messageContent = input.trim()
    setInput("")
    await sendMessage(messageContent)
  }

  const handleSuggestedQuestion = async (question: string) => {
    setInput(question)
    await sendMessage(question)
  }

  const clearChat = () => {
    setMessages([])
  }

  const handleEditMessage = (messageId: string, content: string) => {
    setEditingMessageId(messageId)
    setEditingContent(content)
  }

  const handleUpdateMessage = async (messageId: string, newContent: string) => {
    // Update the message content
    setMessages((currentMessages) =>
      currentMessages.map((msg) => (msg.id === messageId ? { ...msg, content: newContent } : msg)),
    )

    // Find the message index and trim messages after it
    const messageIndex = messages.findIndex((msg) => msg.id === messageId)
    if (messageIndex !== -1) {
      const messagesUpToEdited = messages.slice(0, messageIndex + 1)
      setMessages(messagesUpToEdited)

      // Regenerate response from this point
      await sendMessage(newContent)
    }

    setEditingMessageId(null)
    setEditingContent("")
  }

  const handleReloadFromMessage = async (messageId: string) => {
    const messageIndex = messages.findIndex((m) => m.id === messageId)
    if (messageIndex !== -1) {
      const userMessageIndex = messages.slice(0, messageIndex).findLastIndex((m) => m.role === "user")
      if (userMessageIndex !== -1) {
        const trimmedMessages = messages.slice(0, userMessageIndex + 1)
        setMessages(trimmedMessages)
        const lastUserMessage = trimmedMessages[trimmedMessages.length - 1]
        if (lastUserMessage) {
          await sendMessage(lastUserMessage.content)
        }
      }
    }
  }

  const suggestedQuestions = [
    "ما هي قدراتك؟",
    "كيف يمكنك مساعدتي؟",
    "أخبرني عن الذكاء الاصطناعي",
    "ما هي أحدث التقنيات؟",
  ]

  return (
    <div className="pt-20 h-screen flex flex-col">
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
        {/* Chat Header */}
        <div className="py-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/images/wolf-logo.png" alt="Wolf AI" width={40} height={40} className="h-10 w-10" />
            <div>
              <h1 className="text-2xl font-bold">Wolf AI</h1>
              <p className="text-muted-foreground">مساعدك الذكي للذكاء الاصطناعي</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearChat}
                className="flex items-center gap-2 bg-transparent"
              >
                <RefreshCw className="h-4 w-4" />
                مسح المحادثة
              </Button>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto py-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <Image
                  src="/images/wolf-logo.png"
                  alt="Wolf AI"
                  width={80}
                  height={80}
                  className="h-20 w-20 mx-auto mb-6 opacity-50"
                />
                <h2 className="text-2xl font-bold mb-4">مرحباً بك في Wolf AI</h2>
                <p className="text-muted-foreground mb-4 max-w-md">
                  أنا هنا لمساعدتك في أي شيء تحتاجه. اطرح سؤالاً أو اختر من الاقتراحات أدناه
                </p>

                {searchMode && (
                  <div className="flex items-center gap-2 mb-6 text-sm text-primary">
                    <Globe className="h-4 w-4" />
                    <span>وضع البحث الذكي مفعل - يمكنني البحث في الإنترنت للحصول على أحدث المعلومات</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
                  {suggestedQuestions.map((question, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <Button
                        variant="outline"
                        className="w-full text-right justify-start bg-transparent hover:bg-primary/5"
                        onClick={() => handleSuggestedQuestion(question)}
                        disabled={isLoading}
                      >
                        {question}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          ) : (
            <AnimatePresence>
              {sections.map((section) => (
                <motion.div
                  key={section.id}
                  id={`section-${section.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-4"
                >
                  {/* User Message */}
                  <div className="flex gap-3 justify-end">
                    <div className="max-w-[80%] space-y-2">
                      <Card className="bg-primary text-primary-foreground">
                        <CardContent className="p-4">
                          {editingMessageId === section.userMessage.id ? (
                            <div className="space-y-2">
                              <Input
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="bg-primary-foreground text-primary"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault()
                                    handleUpdateMessage(section.userMessage.id, editingContent)
                                  }
                                  if (e.key === "Escape") {
                                    setEditingMessageId(null)
                                    setEditingContent("")
                                  }
                                }}
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => handleUpdateMessage(section.userMessage.id, editingContent)}
                                >
                                  حفظ
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingMessageId(null)
                                    setEditingContent("")
                                  }}
                                >
                                  إلغاء
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                {section.userMessage.content}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs opacity-70">
                                  {section.userMessage.timestamp.toLocaleTimeString("ar-SA", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </p>
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                    onClick={() =>
                                      handleEditMessage(section.userMessage.id, section.userMessage.content)
                                    }
                                  >
                                    <Edit2 className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
                                    onClick={() => handleReloadFromMessage(section.userMessage.id)}
                                  >
                                    <RotateCcw className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                        <User className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {/* Assistant Messages */}
                  {section.assistantMessages.map((message) => (
                    <div key={message.id} className="flex gap-3 justify-start">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      </div>

                      <div className="max-w-[80%] space-y-2">
                        <Card className="bg-card">
                          <CardContent className="p-4">
                            <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                            <p className="text-xs opacity-70 mt-2">
                              {message.timestamp.toLocaleTimeString("ar-SA", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </CardContent>
                        </Card>

                        {message.sources && message.sources.length > 0 && (
                          <Card className="bg-muted/50">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <Globe className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">المصادر:</span>
                              </div>
                              <div className="space-y-1">
                                {message.sources.map((source, index) => (
                                  <a
                                    key={index}
                                    href={source.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block text-xs text-primary hover:underline"
                                  >
                                    [{index + 1}] {source.title}
                                  </a>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {message.relatedQuestions && message.relatedQuestions.length > 0 && (
                          <Card className="bg-muted/30">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm font-medium">أسئلة ذات صلة:</span>
                              </div>
                              <div className="space-y-1">
                                {message.relatedQuestions.map((question, index) => (
                                  <Button
                                    key={index}
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-2 text-xs text-right justify-start w-full"
                                    onClick={() => handleSuggestedQuestion(question)}
                                    disabled={isLoading}
                                  >
                                    {question}
                                  </Button>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
              </div>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm">{searchMode ? "جاري البحث والتحليل..." : "جاري الكتابة..."}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <div className="py-4 border-t border-border">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={searchMode ? "اسأل أي شيء - سأبحث لك في الإنترنت..." : "اكتب رسالتك هنا..."}
                className="text-right pr-32"
                disabled={isLoading}
                maxLength={500}
              />

              <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                {/* Model Toggle Button */}
                <Select value={selectedModel} onValueChange={setSelectedModel}>
                  <SelectTrigger className="w-8 h-8 p-0 border-0 bg-transparent hover:bg-muted/50">
                    <Telescope className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {availableModels.map((model) => (
                      <SelectItem key={model.id} value={model.id}>
                        <div className="text-right">
                          <div className="font-medium">{model.name}</div>
                          <div className="text-xs text-muted-foreground">{model.provider}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Search Mode Toggle Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-muted/50"
                  onClick={activateSearchMode}
                  disabled={isLoading}
                  title="تفعيل وضع البحث"
                >
                  <Globe className={`h-4 w-4 ${searchMode ? "text-primary" : "text-muted-foreground"}`} />
                </Button>

                {/* R1 Mode Button */}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 hover:bg-muted/50"
                  onClick={activateR1Mode}
                  disabled={isLoading}
                  title="تفعيل وضع R1 المتقدم"
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>
            </div>

            <Button type="submit" disabled={!input.trim() || isLoading} className="px-4">
              {isLoading ? <Sparkles className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>

          {input.length > 400 && (
            <p className="text-xs text-muted-foreground mt-1 text-right">{500 - input.length} حرف متبقي</p>
          )}

          {/* Scroll to bottom button */}
          {!isAtBottom && (
            <Button
              variant="outline"
              size="sm"
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-transparent"
              onClick={scrollToBottom}
            >
              التمرير للأسفل
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage
