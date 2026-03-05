"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { flashcardsData } from "@/lib/data"
import { Sparkles, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react"

export function StudySnaps() {
  const [isGenerated, setIsGenerated] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerated(true)
      setIsGenerating(false)
    }, 1000)
  }

  const handleNext = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % flashcardsData.length)
    }, 150)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + flashcardsData.length) % flashcardsData.length
      )
    }, 150)
  }

  if (!isGenerated) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8">
        <Sparkles className="mb-3 h-8 w-8 text-primary/50" />
        <p className="mb-1 text-sm font-medium text-foreground">Study Snaps</p>
        <p className="mb-4 text-xs text-muted-foreground">
          Generate flashcards based on the lecture content for review.
        </p>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          size="sm"
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isGenerating ? (
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
          {isGenerating ? "Generating..." : "Generate Flashcards"}
        </Button>
      </div>
    )
  }

  const card = flashcardsData[currentIndex]

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Study Snaps</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {currentIndex + 1} / {flashcardsData.length}
        </span>
      </div>

      <div
        className="perspective-[1000px] mb-3 cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault()
            setIsFlipped(!isFlipped)
          }
        }}
        aria-label={isFlipped ? "Show question" : "Show answer"}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${card.id}-${isFlipped ? "back" : "front"}`}
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`flex min-h-[140px] items-center justify-center rounded-lg p-6 ${
              isFlipped
                ? "bg-primary/10 border border-primary/20"
                : "bg-secondary"
            }`}
          >
            <div className="text-center">
              <span className="mb-2 inline-block rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {isFlipped ? "Answer" : "Question"}
              </span>
              <p className="text-sm leading-relaxed text-foreground">
                {isFlipped ? card.answer : card.question}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrev}
          className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Previous
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsFlipped(!isFlipped)}
          className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3 w-3" />
          Flip
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
