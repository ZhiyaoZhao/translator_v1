import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const fileExtension = file.name.split(".").pop()?.toLowerCase()
    let content = ""

    switch (fileExtension) {
      case "txt":
      case "md":
        content = await file.text()
        break

      case "pdf":
        // 对于PDF文件，这里需要使用PDF解析库
        // 由于Next.js环境限制，我们先返回提示信息
        content = "PDF文件解析功能需要在服务端实现。请将PDF内容复制到文本翻译区域。"
        break

      case "doc":
      case "docx":
        // 对于Word文档，同样需要专门的解析库
        content = "Word文档解析功能需要在服务端实现。请将文档内容复制到文本翻译区域。"
        break

      case "rtf":
        // RTF文件可以尝试作为文本读取
        const rtfContent = await file.text()
        // 简单的RTF标签清理
        content = rtfContent.replace(/\\[a-z]+\d*\s?/g, "").replace(/[{}]/g, "")
        break

      default:
        return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    return NextResponse.json({ content: content.trim() })
  } catch (error) {
    console.error("Text extraction error:", error)
    return NextResponse.json({ error: "Failed to extract text from file" }, { status: 500 })
  }
}
