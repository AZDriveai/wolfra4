"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import type { Chat } from "@/lib/types/models"

// Simple in-memory storage for development
// In production, you would use a proper database
const chatStorage = new Map<string, Chat>()
const userChats = new Map<string, string[]>()

export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const userChatIds = userChats.get(userId) || []
    const chats = userChatIds
      .map((chatId) => chatStorage.get(chatId))
      .filter((chat): chat is Chat => chat !== undefined)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    return chats
  } catch (error) {
    console.error("Error fetching chats:", error)
    return []
  }
}

export async function getChat(id: string, userId = "anonymous") {
  try {
    const chat = chatStorage.get(id)
    if (!chat || chat.userId !== userId) {
      return null
    }
    return chat
  } catch (error) {
    console.error("Error fetching chat:", error)
    return null
  }
}

export async function saveChat(chat: Chat, userId = "anonymous") {
  try {
    chatStorage.set(chat.id, { ...chat, userId })

    const userChatIds = userChats.get(userId) || []
    if (!userChatIds.includes(chat.id)) {
      userChatIds.push(chat.id)
      userChats.set(userId, userChatIds)
    }

    return chat
  } catch (error) {
    console.error("Error saving chat:", error)
    throw error
  }
}

export async function deleteChat(chatId: string, userId = "anonymous"): Promise<{ error?: string }> {
  try {
    const chat = chatStorage.get(chatId)
    if (!chat || chat.userId !== userId) {
      return { error: "Chat not found" }
    }

    chatStorage.delete(chatId)

    const userChatIds = userChats.get(userId) || []
    const updatedChatIds = userChatIds.filter((id) => id !== chatId)
    userChats.set(userId, updatedChatIds)

    revalidatePath("/")
    return {}
  } catch (error) {
    console.error(`Error deleting chat ${chatId}:`, error)
    return { error: "Failed to delete chat" }
  }
}

export async function clearChats(userId = "anonymous"): Promise<{ error?: string }> {
  try {
    const userChatIds = userChats.get(userId) || []

    if (userChatIds.length === 0) {
      return { error: "No chats to clear" }
    }

    // Delete all user's chats
    userChatIds.forEach((chatId) => {
      chatStorage.delete(chatId)
    })

    userChats.set(userId, [])

    revalidatePath("/")
    redirect("/")
  } catch (error) {
    console.error("Error clearing chats:", error)
    return { error: "Failed to clear chats" }
  }
}
