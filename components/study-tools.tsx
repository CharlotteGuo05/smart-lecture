"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sparkles, Network } from "lucide-react"
import { StudySnaps } from "@/components/study-snaps"
import { KnowledgeMap } from "@/components/knowledge-map"

// Define the blueprint structure that matches the API response
interface BlueprintSection {
  title: string;
  subsections: { title: string; timestamp: string; summary: string }[];
}

interface Blueprint {
  sections: BlueprintSection[];
}

interface Flashcard {
  question: string;
  answer: string;
}

interface StudyToolsProps {
  blueprint: Blueprint | null;
  flashcards: Flashcard[] | null;
  videoTitle?: string;
}

export function StudyTools({ blueprint, flashcards, videoTitle }: StudyToolsProps) {
  const [activeTab, setActiveTab] = useState<'none' | 'flashcards' | 'knowledge-map'>('none')

  const handleFlashcardsClick = () => {
    setActiveTab(activeTab === 'flashcards' ? 'none' : 'flashcards')
  }

  const handleKnowledgeMapClick = () => {
    setActiveTab(activeTab === 'knowledge-map' ? 'none' : 'knowledge-map')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Tools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <Button
            onClick={handleFlashcardsClick}
            variant={activeTab === 'flashcards' ? "default" : "outline"}
            className="gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {activeTab === 'flashcards' ? "Hide" : "Generate"} Study Snaps
          </Button>

          <Button
            onClick={handleKnowledgeMapClick}
            variant={activeTab === 'knowledge-map' ? "default" : "outline"}
            className="gap-2"
            disabled={!blueprint || !blueprint.sections || blueprint.sections.length === 0}
          >
            <Network className="h-4 w-4" />
            {activeTab === 'knowledge-map' ? "Hide" : "Generate"} Knowledge Map
          </Button>
        </div>

        {activeTab === 'flashcards' && (
          <div>
            <h3 className="text-sm font-semibold mb-4">Study Snaps</h3>
            <StudySnaps 
              flashcards={flashcards} 
              blueprint={blueprint} 
              videoTitle={videoTitle}
            />
          </div>
        )}

        {activeTab === 'knowledge-map' && blueprint && blueprint.sections && blueprint.sections.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-4">Knowledge Map</h3>
            <KnowledgeMap
              videoTitle={videoTitle || "Course Knowledge Map"}
              blueprint={blueprint}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
