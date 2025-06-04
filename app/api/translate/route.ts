import { type NextRequest, NextResponse } from "next/server"
import { translateText } from "@/lib/translation-service"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { text, sourceLanguage, targetLanguage } = body

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const translatedText = await translateText({
      text,
      sourceLanguage,
      targetLanguage,
    })

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ error: "Translation service error" }, { status: 500 })
  }
}
