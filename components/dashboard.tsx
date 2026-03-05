"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { VideoPlayer, type VideoPlayerRef } from "@/components/video-player"
import { LectureNavigator } from "@/components/lecture-navigator"
import { ProfessorChat } from "@/components/professor-chat"
import { StudySnaps } from "@/components/study-snaps"
import { KnowledgeMap } from "@/components/knowledge-map"
import { DEMO_VIDEO_URL } from "@/lib/data"

export function Dashboard({ videoUrl }: { videoUrl: string | null }) {
  const videoRef = useRef<VideoPlayerRef>(null)

  const handleSeek = (seconds: number) => {
    videoRef.current?.seekTo(seconds)
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
          <div className="grid gap-4 md:grid-cols-2">
            <StudySnaps />
            <KnowledgeMap />
          </div>
        </div>
      </div>

      {/* Right Sidebar - Increased width for text content */}
      <aside className="flex w-full flex-col border-t border-border lg:w-[480px] lg:border-l lg:border-t-0">
        {/* Lecture Navigator - Top: scrollable within constrained height */}
        <div className="flex min-h-[200px] basis-1/2 flex-col overflow-hidden border-b border-border">
          <LectureNavigator onSeek={handleSeek} />
        </div>
        {/* Professor Chat - Bottom: fills remaining space */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ProfessorChat onSeek={handleSeek} />
        </div>
      </aside>
    </motion.div>
  )
}
