"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  type ChatMessage,
  mockResponses,
  defaultResponse,
} from "@/lib/data"
import { MessageSquare, Send, Clock, Bot, User } from "lucide-react"

interface ProfessorChatProps {
  onSeek: (seconds: number) => void
}

export function ProfessorChat({ onSeek }: ProfessorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim() || isTyping) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    }

    setMessages((prev) => [...prev, userMessage])
    const query = input.trim().toLowerCase()
    setInput("")
    setIsTyping(true)

    setTimeout(() => {
      const matched = mockResponses.find((r) =>
        r.keywords.some((k) => query.includes(k))
      )
      const response = matched
        ? { ...matched.response, id: `r-${Date.now()}` }
        : { ...defaultResponse, id: `r-${Date.now()}` }

      setMessages((prev) => [...prev, response])
      setIsTyping(false)
    }, 1200)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <MessageSquare className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">AI Professor</h3>
      </div>

      <ScrollArea className="flex-1 p-3" ref={scrollRef}>
        <div className="space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">
                Ask the AI Professor a question<br />
                and get answers based on the lecture content.
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-accent text-foreground"
                }`}
              >
                <p>{msg.content}</p>
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {msg.citations.map((cite, i) => (
                      <Button
                        key={i}
                        variant="ghost"
                        size="sm"
                        onClick={() => onSeek(cite.seconds)}
                        className="h-5 gap-1 rounded-sm bg-primary/10 px-1.5 py-0 text-[10px] font-medium text-primary hover:bg-primary/20 hover:text-primary"
                      >
                        <Clock className="h-2.5 w-2.5" />
                        {cite.timestamp} - {cite.text}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <User className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15">
                <Bot className="h-3 w-3 text-primary" />
              </div>
              <div className="rounded-lg bg-accent px-3 py-2">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask the professor..."
            className="h-8 flex-1 bg-secondary text-xs text-foreground placeholder:text-muted-foreground"
            disabled={isTyping}
          />
          <Button
            type="submit"
            size="sm"
            disabled={!input.trim() || isTyping}
            className="h-8 w-8 bg-primary p-0 text-primary-foreground hover:bg-primary/90"
          >
            <Send className="h-3.5 w-3.5" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
