"use client"

import { motion } from "framer-motion"
import { Loader2, BookOpen, Brain, Sparkles } from "lucide-react"

export function LoadingScreen() {
  const steps = [
    { icon: BookOpen, text: "Parsing video content..." },
    { icon: Brain, text: "Analyzing lecture structure..." },
    { icon: Sparkles, text: "Generating lecture blueprint..." },
  ]

  return (
    <div className="flex h-full items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-6"
      >
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>

        <div className="text-center">
          <h2 className="mb-2 text-lg font-semibold text-foreground">
            Analyzing lecture, generating blueprint...
          </h2>
          <p className="text-sm text-muted-foreground">
            Building your smart learning dashboard
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.5 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                <step.icon className="h-4 w-4 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{step.text}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
