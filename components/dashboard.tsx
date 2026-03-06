"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { VideoPlayer, type VideoPlayerRef } from "@/components/video-player"
import { LectureNavigator } from "@/components/lecture-navigator"
import { ProfessorChat } from "@/components/professor-chat"
import { StudySnaps } from "@/components/study-snaps"
import { KnowledgeMap } from "@/components/knowledge-map"
import { DEMO_VIDEO_URL } from "@/lib/data"

// Define the blueprint structure that matches the API response
interface BlueprintSection {
  title: string;
  subsections: { title: string; timestamp: string; summary: string }[];
}

interface Blueprint {
  sections: BlueprintSection[];
}

export function Dashboard({ videoUrl, lectureData, flashcards, showKnowledgeMap }: { videoUrl: string | null; lectureData: Blueprint | null; flashcards?: any; showKnowledgeMap?: boolean }) {
  const videoRef = useRef<VideoPlayerRef>(null)

  const handleSeek = (seconds: number) => {
    videoRef.current?.seekTo(seconds)
  }

  // Helper function to extract video title from URL (simplified)
  function extractVideoTitle(url: string): string {
    // For now, return a generic title. In a real implementation, you'd fetch the actual title
    return "YouTube Lecture"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex h-[calc(100vh-57px)] flex-col lg:flex-row"
    >
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Video Player - Reduced width */}
          <VideoPlayer ref={videoRef} url={videoUrl || DEMO_VIDEO_URL} />

          {/* On-Demand Generation Cards */}
          <div className="space-y-4">
            <StudySnaps 
              flashcards={flashcards || null}
              blueprint={lectureData} 
              videoTitle={videoUrl ? extractVideoTitle(videoUrl) : "Course Knowledge Map"}
            />
            {showKnowledgeMap && (
              <div className="w-full">
                <KnowledgeMap 
                  videoTitle={videoUrl ? extractVideoTitle(videoUrl) : "Course Knowledge Map"} 
                  blueprint={lectureData} 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Increased width for text content */}
      <aside className="flex w-full flex-col border-t border-border lg:w-[480px] lg:border-l lg:border-t-0">
        {/* Lecture Navigator - Top: scrollable within constrained height */}
        <div className="flex min-h-[200px] basis-1/2 flex-col overflow-hidden border-b border-border">
          <LectureNavigator onSeek={handleSeek} lectureData={lectureData} />
        </div>
        {/* Professor Chat - Bottom: fills remaining space */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ProfessorChat onSeek={handleSeek} />
        </div>
      </aside>
    </motion.div>
  )
}
