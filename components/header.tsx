"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, MessageSquare, Home, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { id: "home", label: "الرئيسية", icon: Home, href: "/home" },
    { id: "about", label: "من نحن", icon: Users, href: "/about" },
    { id: "chat", label: "الدردشة", icon: MessageSquare, href: "/chat" },
  ]

  const getActiveSection = () => {
    if (pathname.startsWith("/home")) return "home"
    if (pathname.startsWith("/about")) return "about"
    if (pathname.startsWith("/chat")) return "chat"
    return "home"
  }

  const activeSection = getActiveSection()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/home" className="flex items-center space-x-3 rtl:space-x-reverse">
          <Image src="/images/wolf-logo.png" alt="شعار Wolf AI" width={40} height={40} className="h-10 w-10" />
          <h1 className="text-xl font-bold text-foreground">Wolf AI</h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6 rtl:space-x-reverse">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                asChild
                className="flex items-center space-x-2 rtl:space-x-reverse"
              >
                <Link href={item.href}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </Button>
            )
          })}
        </nav>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="container mx-auto px-4 py-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  asChild
                  className="w-full justify-start flex items-center space-x-2 rtl:space-x-reverse"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Link href={item.href}>
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header
