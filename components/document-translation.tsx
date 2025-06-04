"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Download, Trash2, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadedFile {
  file: File
  content: string
  translatedContent?: string
  progress: number
  status: "pending" | "extracting" | "translating" | "completed" | "error"
}

const languages = [
  { code: "zh", name: "中文" },
  { code: "en", name: "英语" },
  { code: "ja", name: "日语" },
  { code: "ko", name: "韩语" },
  { code: "fr", name: "法语" },
  { code: "de", name: "德语" },
  { code: "es", name: "西班牙语" },
  { code: "ru", name: "俄语" },
  { code: "ar", name: "阿拉伯语" },
]

const supportedFileTypes = [".txt", ".md", ".pdf", ".doc", ".docx", ".rtf"]

export default function DocumentTranslation() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [sourceLanguage, setSourceLanguage] = useState("zh")
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // 处理文件选择
  const handleFileSelect = useCallback(
    (selectedFiles: FileList | null) => {
      if (!selectedFiles) return

      const newFiles: UploadedFile[] = []

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i]

        // 检查文件类型
        const fileExtension = "." + file.name.split(".").pop()?.toLowerCase()
        if (!supportedFileTypes.includes(fileExtension)) {
          toast({
            title: "不支持的文件格式",
            description: `文件 ${file.name} 的格式不受支持`,
            variant: "destructive",
          })
          continue
        }

        // 检查文件大小 (10MB限制)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "文件过大",
            description: `文件 ${file.name} 超过10MB限制`,
            variant: "destructive",
          })
          continue
        }

        newFiles.push({
          file,
          content: "",
          progress: 0,
          status: "pending",
        })
      }

      if (newFiles.length > 0) {
        setFiles((prev) => [...prev, ...newFiles])
        // 开始处理文件
        newFiles.forEach((fileData) => processFile(fileData))
      }
    },
    [toast],
  )

  // 处理文件内容提取
  const processFile = async (fileData: UploadedFile) => {
    try {
      // 更新状态为提取中
      setFiles((prev) => prev.map((f) => (f.file === fileData.file ? { ...f, status: "extracting", progress: 20 } : f)))

      const formData = new FormData()
      formData.append("file", fileData.file)

      const response = await fetch("/api/extract-text", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("文件内容提取失败")
      }

      const { content } = await response.json()

      // 更新文件内容
      setFiles((prev) =>
        prev.map((f) => (f.file === fileData.file ? { ...f, content, progress: 50, status: "pending" } : f)),
      )

      toast({
        title: "文件处理完成",
        description: `${fileData.file.name} 内容提取成功`,
      })
    } catch (error) {
      console.error("File processing error:", error)
      setFiles((prev) => prev.map((f) => (f.file === fileData.file ? { ...f, status: "error", progress: 0 } : f)))

      toast({
        title: "文件处理失败",
        description: `无法处理文件 ${fileData.file.name}`,
        variant: "destructive",
      })
    }
  }

  // 翻译文档
  const translateDocument = async (fileData: UploadedFile) => {
    if (!fileData.content) return

    try {
      setFiles((prev) =>
        prev.map((f) => (f.file === fileData.file ? { ...f, status: "translating", progress: 60 } : f)),
      )

      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: fileData.content,
          sourceLanguage,
          targetLanguage,
        }),
      })

      if (!response.ok) {
        throw new Error("翻译失败")
      }

      const { translatedText } = await response.json()

      setFiles((prev) =>
        prev.map((f) =>
          f.file === fileData.file
            ? {
                ...f,
                translatedContent: translatedText,
                status: "completed",
                progress: 100,
              }
            : f,
        ),
      )

      toast({
        title: "翻译完成",
        description: `${fileData.file.name} 翻译成功`,
      })
    } catch (error) {
      console.error("Translation error:", error)
      setFiles((prev) => prev.map((f) => (f.file === fileData.file ? { ...f, status: "error" } : f)))

      toast({
        title: "翻译失败",
        description: `${fileData.file.name} 翻译失败`,
        variant: "destructive",
      })
    }
  }

  // 下载翻译结果
  const downloadTranslation = (fileData: UploadedFile) => {
    if (!fileData.translatedContent) return

    const blob = new Blob([fileData.translatedContent], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `translated_${fileData.file.name.replace(/\.[^/.]+$/, "")}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // 删除文件
  const removeFile = (fileToRemove: UploadedFile) => {
    setFiles((prev) => prev.filter((f) => f.file !== fileToRemove.file))
  }

  // 拖拽处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect],
  )

  // 获取状态颜色
  const getStatusColor = (status: UploadedFile["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "translating":
      case "extracting":
        return "bg-blue-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // 获取状态文本
  const getStatusText = (status: UploadedFile["status"]) => {
    switch (status) {
      case "pending":
        return "待处理"
      case "extracting":
        return "提取中"
      case "translating":
        return "翻译中"
      case "completed":
        return "已完成"
      case "error":
        return "处理失败"
    }
  }

  return (
    <div className="space-y-6">
      {/* 语言选择 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">源语言</label>
          <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">目标语言</label>
          <Select value={targetLanguage} onValueChange={setTargetLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 文件上传区域 */}
      <Card>
        <CardHeader>
          <CardTitle>文档翻译</CardTitle>
          <CardDescription>支持 {supportedFileTypes.join(", ")} 格式，最大10MB</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">{isDragging ? "释放文件以上传" : "拖放文件到此处"}</p>
            <p className="text-sm text-muted-foreground mb-4">或者点击下方按钮选择文件</p>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline">
              <FileText className="h-4 w-4 mr-2" />
              选择文件
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={supportedFileTypes.join(",")}
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* 文件列表 */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">上传的文件</h3>
          {files.map((fileData, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span className="font-medium">{fileData.file.name}</span>
                    <Badge variant="outline" className={`${getStatusColor(fileData.status)} text-white border-none`}>
                      {getStatusText(fileData.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {fileData.status === "pending" && fileData.content && (
                      <Button size="sm" onClick={() => translateDocument(fileData)}>
                        开始翻译
                      </Button>
                    )}
                    {fileData.status === "completed" && (
                      <Button size="sm" variant="outline" onClick={() => downloadTranslation(fileData)}>
                        <Download className="h-4 w-4 mr-1" />
                        下载
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => removeFile(fileData)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {fileData.progress > 0 && fileData.status !== "completed" && (
                  <Progress value={fileData.progress} className="mb-2" />
                )}

                {fileData.status === "error" && (
                  <div className="flex items-center space-x-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>处理失败，请重新上传</span>
                  </div>
                )}

                {fileData.content && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">原文内容</label>
                      <Textarea value={fileData.content} readOnly className="mt-1 h-32 text-sm" />
                    </div>
                    {fileData.translatedContent && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">翻译结果</label>
                        <Textarea value={fileData.translatedContent} readOnly className="mt-1 h-32 text-sm" />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
