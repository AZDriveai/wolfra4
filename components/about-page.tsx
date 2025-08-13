"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Target, Eye, Heart, Users, Github, Mail, Globe, Code, Database, Cpu } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

const AboutPage = () => {
  const values = [
    {
      icon: Target,
      title: "الهدف",
      description: "نسعى لجعل الذكاء الاصطناعي متاحاً للجميع بطريقة سهلة ومفيدة",
    },
    {
      icon: Eye,
      title: "الرؤية",
      description: "أن نكون الرائدين في تقديم حلول الذكاء الاصطناعي المبتكرة",
    },
    {
      icon: Heart,
      title: "القيم",
      description: "الشفافية، الإبداع، والالتزام بأعلى معايير الجودة",
    },
  ]

  const stats = [
    { number: "10K+", label: "مستخدم نشط" },
    { number: "50K+", label: "محادثة يومياً" },
    { number: "99.9%", label: "وقت التشغيل" },
    { number: "24/7", label: "دعم فني" },
  ]

  const technologies = [
    { name: "React", icon: Code },
    { name: "Node.js", icon: Database },
    { name: "AI/ML", icon: Cpu },
    { name: "Cloud", icon: Globe },
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="mb-8">
              <Image
                src="/images/wolf-logo.png"
                alt="Wolf AI"
                width={96}
                height={96}
                className="h-24 w-24 mx-auto mb-6"
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">من نحن</h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              نحن فريق من المطورين والباحثين المتخصصين في الذكاء الاصطناعي، نعمل على تطوير حلول مبتكرة تساعد الأفراد
              والشركات على الاستفادة من قوة التكنولوجيا الحديثة
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">قيمنا ومبادئنا</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نؤمن بأن التكنولوجيا يجب أن تخدم الإنسان وتحسن من جودة حياته
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center hover:shadow-lg transition-all duration-300 hover:scale-105">
                    <CardContent className="p-8">
                      <div className="mb-6 flex justify-center">
                        <div className="p-4 bg-primary/10 rounded-full">
                          <Icon className="h-10 w-10 text-primary" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold mb-4">{value.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">إنجازاتنا بالأرقام</h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">التقنيات التي نستخدمها</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              نعتمد على أحدث التقنيات لضمان أفضل أداء وتجربة مستخدم
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {technologies.map((tech, index) => {
              const Icon = tech.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Badge variant="secondary" className="text-lg px-4 py-2 flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {tech.name}
                  </Badge>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">فريق العمل</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              فريق متخصص من المطورين والباحثين يعمل على تطوير أفضل الحلول
            </p>
          </motion.div>

          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <CardContent>
                <Users className="h-16 w-16 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-4">فريق متنوع ومتخصص</h3>
                <p className="text-muted-foreground mb-6">
                  يضم فريقنا خبراء في مجالات مختلفة من البرمجة والذكاء الاصطناعي وتجربة المستخدم، جميعهم يعملون بشغف
                  لتقديم أفضل الحلول
                </p>
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    تواصل معنا
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">تواصل معنا</h2>
            <p className="text-lg text-muted-foreground mb-8">نحن هنا لمساعدتك والإجابة على جميع استفساراتك</p>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Github className="h-5 w-5 text-primary" />
                <a
                  href="https://github.com/d3axai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  https://github.com/d3axai
                </a>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <a href="mailto:balqees0alalawi@gmail.com" className="text-primary hover:underline">
                  balqees0alalawi@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
