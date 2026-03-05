"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { blueprintData } from "@/lib/data"
import { Network, Loader2 } from "lucide-react"
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  Handle,
  Position,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

// Define the blueprint structure that matches the API response
interface BlueprintSection {
  title: string;
  subsections: { title: string; timestamp: string; summary: string }[];
}

interface Blueprint {
  sections: BlueprintSection[];
}

function RootNode({ data }: { data: { label: string } }) {
  return (
    <div className="rounded-xl border-2 border-primary bg-primary/15 px-5 py-3 shadow-lg shadow-primary/5">
      <p className="text-center text-base font-bold text-primary">{data.label}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  )
}

function SectionNode({ data }: { data: { label: string } }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-2.5 shadow-md">
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />
      <p className="text-center text-sm font-semibold text-foreground">{data.label}</p>
      <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
    </div>
  )
}

function SubNode({ data }: { data: { label: string; timestamp: string } }) {
  return (
    <div className="rounded-md border border-border/60 bg-secondary px-3 py-2 shadow-sm">
      <Handle type="target" position={Position.Top} className="!bg-muted-foreground/50" />
      <p className="text-center text-xs text-foreground/80">{data.label}</p>
      <p className="mt-0.5 text-center font-mono text-[10px] text-primary">{data.timestamp}</p>
    </div>
  )
}

const nodeTypes: NodeTypes = {
  root: RootNode,
  section: SectionNode,
  sub: SubNode,
}

function buildGraph(videoTitle: string, blueprint: Blueprint | null) {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // Root node with video title
  nodes.push({
    id: "root",
    type: "root",
    position: { x: 400, y: 0 },
    data: { label: videoTitle || "Course Knowledge Map" },
  })

  if (!blueprint || !blueprint.sections || blueprint.sections.length === 0) {
    return { nodes, edges }
  }

  const sectionSpacing = 220
  const startX = -(((blueprint.sections.length - 1) * sectionSpacing) / 2) + 400

  blueprint.sections.forEach((section, i) => {
    const sectionId = `s-${i}`
    const sectionX = startX + i * sectionSpacing

    nodes.push({
      id: sectionId,
      type: "section",
      position: { x: sectionX, y: 120 },
      data: { label: section.title.replace(/^\d+\.\s*/, "") },
    })

    edges.push({
      id: `root-${sectionId}`,
      source: "root",
      target: sectionId,
      style: { stroke: "oklch(0.65 0.2 160)", strokeWidth: 1.5 },
      animated: true,
    })

    const subSpacing = 160
    const subStartX = sectionX - (((section.subsections.length - 1) * subSpacing) / 2)

    section.subsections.forEach((sub, j) => {
      const subId = `${sectionId}-sub-${j}`
      nodes.push({
        id: subId,
        type: "sub",
        position: { x: subStartX + j * subSpacing, y: 250 + (j % 2) * 40 },
        data: { label: sub.title, timestamp: sub.timestamp },
      })

      edges.push({
        id: `${sectionId}-${subId}`,
        source: sectionId,
        target: subId,
        style: { stroke: "oklch(0.4 0 0)", strokeWidth: 1 },
      })
    })
  })

  return { nodes, edges }
}

export function KnowledgeMap({ videoTitle, blueprint }: { videoTitle: string; blueprint: Blueprint | null }) {
  const [isGenerated, setIsGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = useCallback(() => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerated(true)
      setIsGenerating(false)
    }, 1200)
  }, [])

  // Auto-generate when blueprint data is available
  if (blueprint && blueprint.sections && blueprint.sections.length > 0 && !isGenerated && !isGenerating) {
    handleGenerate()
  }

  if (!isGenerated) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-card p-8">
        <Network className="mb-3 h-8 w-8 text-primary/50" />
        <p className="mb-1 text-base font-medium text-foreground">Knowledge Map</p>
        <p className="mb-4 text-sm text-muted-foreground">
          Generate a structured knowledge map of the lecture content.
        </p>
        <Button
          onClick={handleGenerate}
          disabled={isGenerating || (!blueprint?.sections?.length)}
          size="sm"
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isGenerating ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Network className="h-3.5 w-3.5" />
          )}
          {isGenerating ? "Generating..." : "Generate Knowledge Map"}
        </Button>
        {blueprint && blueprint.sections && blueprint.sections.length === 0 && (
          <p className="mt-2 text-xs text-muted-foreground">No blueprint data available</p>
        )}
      </div>
    )
  }

  const { nodes, edges } = buildGraph(videoTitle, blueprint)

  return (
    <div className="rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <Network className="h-4 w-4 text-primary" />
        <h3 className="text-2xl font-semibold text-foreground">Knowledge Map</h3>
      </div>
      <div className="h-[400px]">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          fitView
          proOptions={{ hideAttribution: true }}
          className="bg-card"
          minZoom={0.2}
          maxZoom={2.0}
        >
          <Background color="oklch(0.3 0 0)" gap={20} size={1} />
          <Controls
            className="[&>button]:!border-border [&>button]:!bg-secondary [&>button]:!text-foreground [&>button]:hover:!bg-accent"
          />
        </ReactFlow>
      </div>
    </div>
  )
}
