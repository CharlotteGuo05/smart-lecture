"use client"

import { useState, useCallback } from "react"
import { Header } from "@/components/header"
import { Dashboard } from "@/components/dashboard"
import { LoadingScreen } from "@/components/loading-screen"
import { GraduationCap, BookOpen, Brain, Sparkles } from "lucide-react"

type AppState = "idle" | "loading" | "active"

export default function Home() {
  const [state, setState] = useState<AppState>("idle")

  const handleProcessVideo = useCallback((_url: string) => {
    setState("loading")
    setTimeout(() => {
      setState("active")
    }, 2000)
  }, [])

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header
        onProcessVideo={handleProcessVideo}
        isLoading={state === "loading"}
      />

      {state === "idle" && (
        <div className="flex flex-1 items-center justify-center">
          <div className="flex max-w-md flex-col items-center gap-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <GraduationCap className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
                Smart Lecturer
              </h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Paste a YouTube lecture link, and AI will analyze the content,<br />
                generating structured blueprints, flashcards, and knowledge maps.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { icon: BookOpen, label: "Blueprint" },
                { icon: Brain, label: "AI Tutor" },
                { icon: Sparkles, label: "Flashcards" },
              ].map((feature) => (
                <div
                  key={feature.label}
                  className="flex flex-col items-center gap-2 rounded-lg border border-border bg-card p-4"
                >
                  <feature.icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-medium text-foreground">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {state === "loading" && (
        <div className="flex-1">
          <LoadingScreen />
        </div>
      )}

      {state === "active" && <Dashboard />}
    </div>
  )
}
