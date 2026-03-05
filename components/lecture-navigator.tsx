"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { blueprintData } from "@/lib/data"
import { Clock, BookOpen } from "lucide-react"

// Define the blueprint structure that matches the API response
interface BlueprintSection {
  title: string;
  subsections: { title: string; timestamp: string; summary: string }[];
}

interface Blueprint {
  sections: BlueprintSection[];
}

interface LectureNavigatorProps {
  onSeek: (seconds: number) => void
  lectureData: Blueprint | null
}

// Helper function to convert HH:MM:SS timestamp to seconds
function convertTimestampToSeconds(timestamp: string): number {
  const parts = timestamp.split(':').map(Number)
  if (parts.length === 3) {
    // HH:MM:SS format
    return parts[0] * 3600 + parts[1] * 60 + parts[2]
  } else if (parts.length === 2) {
    // MM:SS format
    return parts[0] * 60 + parts[1]
  }
  return 0
}

export function LectureNavigator({ onSeek, lectureData }: LectureNavigatorProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-4 py-3">
        <BookOpen className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Lecture Blueprint</h3>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="p-2">
          {lectureData ? (
            <Accordion type="multiple" defaultValue={["section-0", "section-1"]} className="space-y-1">
              {lectureData.sections.map((section, i) => (
                <AccordionItem
                  key={i}
                  value={`section-${i}`}
                  className="rounded-md border-none"
                >
                  <AccordionTrigger className="rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:no-underline [&[data-state=open]]:bg-accent/50">
                    {section.title}
                  </AccordionTrigger>
                  <AccordionContent className="pb-1 pt-0">
                    <div className="ml-2 space-y-0.5 border-l border-border pl-3">
                      {section.subsections.map((sub, j) => (
                        <div
                          key={j}
                          className="group flex items-start gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-accent/50"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onSeek(convertTimestampToSeconds(sub.timestamp))}
                            className="h-5 shrink-0 gap-1 rounded px-1.5 py-0 text-[10px] font-mono text-primary hover:bg-primary/10 hover:text-primary cursor-pointer"
                          >
                            <Clock className="h-2.5 w-2.5 cursor-pointer" />
                            {sub.timestamp}
                          </Button>
                          <div className="min-w-0 flex-1">
                            <p className="text-base font-medium leading-tight text-foreground/90">
                              {sub.title}
                            </p>
                            <p className="mt-0.5 text-sm leading-snug text-muted-foreground">
                              {sub.summary}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <p className="text-base text-muted-foreground">
                Process a video to generate<br />
                the lecture blueprint.
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
