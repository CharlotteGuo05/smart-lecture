"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Download, 
  Copy, 
  Key, 
  BookOpen, 
  Brain, 
  FileText 
} from "lucide-react"
import { toast } from "sonner"

// Define the flashcard structure that matches the API response
interface Flashcard {
  question: string;
  answer: string;
}

// Define the blueprint structure for knowledge map export
interface BlueprintSection {
  title: string;
  subsections: { title: string; timestamp: string; summary: string }[];
}

interface Blueprint {
  sections: BlueprintSection[];
}

interface StudySnapsProps {
  flashcards: Flashcard[] | null;
  blueprint: Blueprint | null;
  videoTitle?: string;
}

export function StudySnaps({ flashcards, blueprint, videoTitle }: StudySnapsProps) {
  const [isGenerated, setIsGenerated] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<'flashcards' | 'terms' | 'export'>('flashcards')

  // Auto-generate when flashcards data is available
  useEffect(() => {
    if (flashcards && flashcards.length > 0 && !isGenerated && !isGenerating) {
      handleGenerate()
    }
  }, [flashcards, isGenerated, isGenerating])

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
      setCurrentIndex((prev) => (prev + 1) % (flashcards?.length || 1))
    }, 150)
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex(
        (prev) => (prev - 1 + (flashcards?.length || 1)) % (flashcards?.length || 1)
      )
    }, 150)
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const extractKeyTerms = (): string[] => {
    if (!flashcards) return []
    
    // Extract key terms from questions and answers
    const allText = flashcards.map(card => `${card.question} ${card.answer}`).join(' ')
    
    // Simple keyword extraction - could be enhanced with NLP
    const commonWords = ['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall']
    
    const words = allText
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
    
    const wordCounts = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const sortedWords = Object.entries(wordCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1))
    
    return sortedWords
  }

  const generateKnowledgeMapMarkdown = (): string => {
    if (!blueprint || !videoTitle) return ''
    
    let markdown = `# ${videoTitle}\n\n`
    
    blueprint.sections.forEach((section, sectionIndex) => {
      markdown += `## ${section.title}\n\n`
      
      section.subsections.forEach((subsection, subsectionIndex) => {
        markdown += `### ${subsection.title}\n`
        markdown += `**Time:** ${subsection.timestamp}\n\n`
        markdown += `${subsection.summary}\n\n`
      })
    })
    
    return markdown
  }

  const exportToMarkdown = () => {
    const markdown = generateKnowledgeMapMarkdown()
    if (!markdown) {
      toast.error("No blueprint data available for export")
      return
    }
    
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${videoTitle || 'lecture'}-knowledge-map.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success("Knowledge map exported successfully")
  }

  const copyToClipboard = async () => {
    const markdown = generateKnowledgeMapMarkdown()
    if (!markdown) {
      toast.error("No blueprint data available to copy")
      return
    }
    
    try {
      await navigator.clipboard.writeText(markdown)
      toast.success("Knowledge map copied to clipboard")
    } catch (err) {
      toast.error("Failed to copy to clipboard")
    }
  }

  if (!isGenerated) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Sparkles className="mb-3 h-8 w-8 text-primary/50" />
          <CardTitle className="mb-1 text-base font-medium">Study Snaps</CardTitle>
          <p className="mb-4 text-sm text-muted-foreground text-center">
            Generate flashcards and key terms based on the lecture content for review.
          </p>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || (!flashcards?.length)}
            size="sm"
            className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isGenerating ? (
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
            ) : (
              <Sparkles className="h-3.5 w-3.5" />
            )}
            {isGenerating ? "Generating..." : "Generate Study Snaps"}
          </Button>
          {flashcards && flashcards.length === 0 && (
            <p className="mt-2 text-xs text-muted-foreground">No flashcards available</p>
          )}
        </CardContent>
      </Card>
    )
  }

  const currentCard = flashcards?.[currentIndex]
  const keyTerms = extractKeyTerms()

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <CardTitle className="text-2xl font-semibold">Study Snaps</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {currentIndex + 1} / {flashcards?.length || 0}
            </span>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1">
          {[
            { key: 'flashcards', label: 'Flashcards', icon: Brain },
            { key: 'terms', label: 'Key Terms', icon: Key },
            { key: 'export', label: 'Export', icon: FileText }
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab.key as any)}
                className="gap-2 text-sm"
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Flashcards Tab */}
        {activeTab === 'flashcards' && currentCard && (
          <>
            <div
              className="perspective-[1000px] mb-3 cursor-pointer"
              onClick={handleFlip}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleFlip()
                }
              }}
              aria-label={isFlipped ? "Show question" : "Show answer"}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${currentIndex}-${isFlipped ? "back" : "front"}`}
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
                    <span className="mb-2 inline-block rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {isFlipped ? "Answer" : "Question"}
                    </span>
                    <p className="text-base leading-relaxed text-foreground">
                      {isFlipped ? currentCard.answer : currentCard.question}
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
                disabled={flashcards.length <= 1}
                className="h-7 gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Previous
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFlip}
                className="h-7 gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3" />
                Flip
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNext}
                disabled={flashcards.length <= 1}
                className="h-7 gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </>
        )}

        {/* Key Terms Tab */}
        {activeTab === 'terms' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground">Key Terms & Concepts</h4>
            </div>
            {keyTerms.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {keyTerms.map((term, index) => (
                  <div
                    key={index}
                    className="rounded-md border border-border bg-secondary px-3 py-2 text-sm"
                  >
                    {term}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No key terms extracted yet.</p>
            )}
          </div>
        )}

        {/* Export Tab */}
        {activeTab === 'export' && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <h4 className="font-semibold text-foreground">Knowledge Map Export</h4>
            </div>
            <p className="text-sm text-muted-foreground">
              Export the lecture structure as a markdown file for use in knowledge management tools.
            </p>
            <div className="flex gap-2">
              <Button
                onClick={exportToMarkdown}
                disabled={!blueprint || !videoTitle}
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Download Markdown
              </Button>
              <Button
                variant="outline"
                onClick={copyToClipboard}
                disabled={!blueprint || !videoTitle}
                className="gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
            </div>
            {(!blueprint || !videoTitle) && (
              <p className="text-xs text-muted-foreground">Process a video to enable export functionality.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
