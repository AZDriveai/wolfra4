"use client"
import { redirect } from "next/navigation"

export default function RootPage() {
  redirect("/home")
}

// export default function App() {
//   const [activeSection, setActiveSection] = useState("home")
//
//   // Force dark mode
//   useEffect(() => {
//     document.documentElement.classList.add("dark")
//   }, [])
//
//   const renderActiveSection = () => {
//     switch (activeSection) {
//       case "home":
//         return <HomePage setActiveSection={setActiveSection} />
//       case "about":
//         return <AboutPage />
//       case "chat":
//         return <ChatPage />
//       default:
//         return <HomePage setActiveSection={setActiveSection} />
//     }
//   }
//
//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       <Header activeSection={activeSection} setActiveSection={setActiveSection} />
//       <main>{renderActiveSection()}</main>
//     </div>
//   )
// }
