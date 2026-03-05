"use client"

import dynamic from "next/dynamic"
import { useRef, useImperativeHandle, forwardRef, useState } from "react"
import type ReactPlayerType from "react-player"

const ReactPlayer = dynamic(() => import("react-player/youtube"), {
  ssr: false,
})

export interface VideoPlayerRef {
  seekTo: (seconds: number) => void
}

interface VideoPlayerProps {
  url: string
}

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  function VideoPlayer({ url }, ref) {
    const playerRef = useRef<ReactPlayerType>(null)
    const [isReady, setIsReady] = useState(false)

    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        playerRef.current?.seekTo(seconds, "seconds")
      },
    }))

    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-secondary">
        {!isReady && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          controls
          onReady={() => setIsReady(true)}
          config={{
            playerVars: {
              modestbranding: 1,
              rel: 0,
            },
          }}
        />
      </div>
    )
  }
)
