"use client"

import HomePage from "@/components/home-page"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const setActiveSection = (section: string) => {
    router.push(`/${section}`)
  }

  return <HomePage setActiveSection={setActiveSection} />
}
