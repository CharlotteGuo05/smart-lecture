"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { GraduationCap, Loader2, Search } from "lucide-react"

interface HeaderProps {
  onProcessVideo: (url: string) => void
  isLoading: boolean
}

export function Header({ onProcessVideo, isLoading }: HeaderProps) {
  const [url, setUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onProcessVideo(url.trim())
    }
  }

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-card/80 px-6 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <GraduationCap className="h-4.5 w-4.5 text-primary-foreground" />
        </div>
        <span className="text-lg font-semibold tracking-tight text-foreground">
          Smart Lecturer
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xl items-center gap-2 px-8"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="url"
            placeholder="Paste a YouTube video link..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-9 bg-secondary pl-9 text-sm text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !url.trim()}
          className="h-9 gap-2 bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Analyzing...
            </>
          ) : (
            "Process Video"
          )}
        </Button>
      </form>

      <div className="w-[140px]" />
    </header>
  )
}
