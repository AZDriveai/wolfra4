"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Zap, Brain, Shield, Sparkles } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface HomePageProps {
  setActiveSection?: (section: string) => void
}

const HomePage = ({ setActiveSection }: HomePageProps) => {
  const router = useRouter()

  const handleNavigation = (section: string) => {
    if (setActiveSection) {
      setActiveSection(section)
    } else {
      router.push(`/${section}`)
    }
  }

  const features = [
    {
      icon: Brain,
      title: "ذكاء متقدم",
      description: "تقنيات الذكاء الاصطناعي الأكثر تطوراً لحل المشاكل المعقدة",
    },
    {
      icon: Zap,
      title: "سرعة فائقة",
      description: "معالجة فورية للبيانات واستجابة سريعة لجميع الاستفسارات",
    },
    {
      icon: Shield,
      title: "أمان عالي",
      description: "حماية متقدمة للبيانات مع أعلى معايير الأمان والخصوصية",
    },
    {
      icon: Sparkles,
      title: "إبداع لا محدود",
      description: "قدرات إبداعية متطورة لتوليد المحتوى والحلول المبتكرة",
    },
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="mb-8">
              {/* Using optimized logo with proper alt text and priority loading */}
              <Image
                src="/images/wolf-logo.png"
                alt="شعار Wolf AI - منصة الذكاء الاصطناعي"
                width={128}
                height={128}
                className="h-32 w-32 mx-auto mb-6 animate-pulse"
                priority
              />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Wolf AI
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              اكتشف قوة الذكاء الاصطناعي مع منصة Wolf AI
              <br />
              حيث التكنولوجيا تلتقي بالإبداع لتحقيق المستحيل
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="text-lg px-8 py-6 group" onClick={() => handleNavigation("chat")}>
                ابدأ الدردشة الآن
                <ArrowRight className="mr-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 bg-transparent"
                onClick={() => handleNavigation("about")}
              >
                تعرف علينا أكثر
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-bounce" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-xl animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-primary/10 rounded-full blur-lg animate-ping" />
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">لماذا تختار Wolf AI؟</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              نحن نقدم تجربة فريدة في عالم الذكاء الاصطناعي مع ميزات متطورة
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:scale-105 border-border/50 bg-card/80 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        <div className="p-3 bg-primary/10 rounded-full">
                          <Icon className="h-8 w-8 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">جاهز لتجربة المستقبل؟</h2>
            <p className="text-xl text-muted-foreground mb-8">
              انضم إلى آلاف المستخدمين الذين يستخدمون Wolf AI لتحقيق أهدافهم
            </p>
            <Button size="lg" className="text-lg px-12 py-6 group" onClick={() => handleNavigation("chat")}>
              ابدأ رحلتك الآن
              <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
