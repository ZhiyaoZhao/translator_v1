import { NextResponse } from "next/server"
import { getModelInfo } from "@/lib/translation-service"

export async function GET() {
  try {
    const modelInfo = await getModelInfo()
    return NextResponse.json(modelInfo)
  } catch (error) {
    console.error("Get model info error:", error)
    return NextResponse.json({ error: "无法获取模型信息" }, { status: 500 })
  }
}
