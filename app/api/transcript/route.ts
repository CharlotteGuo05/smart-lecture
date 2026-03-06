import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const videoId = searchParams.get('videoId')
    
    if (!videoId) {
      return NextResponse.json(
        { error: "Missing videoId parameter" },
        { status: 400 }
      )
    }

    // Try to fetch transcript using YouTube's official API or third-party services
    // Note: This is a simplified implementation. In a production environment,
    // you would want to use a more robust transcript fetching service
    
    const transcriptUrl = `https://www.youtube.com/api/timedtext?vid=${videoId}&type=list`
    
    try {
      const response = await fetch(transcriptUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const transcriptData = await response.text()
      
      // Parse the XML transcript data
      const transcript = parseTranscriptXML(transcriptData)
      
      if (transcript && transcript.length > 0) {
        return NextResponse.json({
          text: transcript.join(' '),
          success: true
        })
      } else {
        return NextResponse.json(
          { error: "No transcript available" },
          { status: 404 }
        )
      }
    } catch (error) {
      console.log("[transcript] Could not fetch transcript:", error)
      
      // Fallback: return a message indicating no transcript available
      return NextResponse.json(
        { 
          text: "",
          message: "No transcript available for this video"
        },
        { status: 200 }
      )
    }
  } catch (err: any) {
    console.error("[transcript]", err)
    return NextResponse.json(
      { error: "Internal Server Error", details: err?.message },
      { status: 500 }
    )
  }
}

function parseTranscriptXML(xmlString: string): string[] {
  // Simple XML parsing for YouTube transcripts
  // This is a basic implementation - in production, you'd want a more robust XML parser
  
  const textMatches = xmlString.match(/<text[^>]*>([^<]+)<\/text>/g)
  if (!textMatches) return []
  
  return textMatches.map(match => {
    const text = match.replace(/<[^>]+>/g, '')
    return text.trim()
  }).filter(text => text.length > 0)
}