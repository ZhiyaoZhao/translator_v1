"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRightLeft, Copy, Volume2, Loader2 } from "lucide-react"
import { translateText } from "@/lib/translation-service"
import { useToast } from "@/hooks/use-toast"
import DocumentTranslation from "./document-translation"

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

export default function TranslationInterface() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [sourceLanguage, setSourceLanguage] = useState("zh")
  const [targetLanguage, setTargetLanguage] = useState("en")
  const [isTranslating, setIsTranslating] = useState(false)
  const [characterCount, setCharacterCount] = useState(0)
  const { toast } = useToast()
  const translationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // 自动翻译功能
  useEffect(() => {
    if (sourceText.trim() === "") {
      setTranslatedText("")
      return
    }

    // 清除之前的超时
    if (translationTimeoutRef.current) {
      clearTimeout(translationTimeoutRef.current)
    }

    // 设置新的超时，500ms后执行翻译
    translationTimeoutRef.current = setTimeout(async () => {
      await handleTranslate()
    }, 500)

    return () => {
      if (translationTimeoutRef.current) {
        clearTimeout(translationTimeoutRef.current)
      }
    }
  }, [sourceText, sourceLanguage, targetLanguage])

  // 更新字符计数
  useEffect(() => {
    setCharacterCount(sourceText.length)
  }, [sourceText])

  // 交换语言
  const swapLanguages = () => {
    const temp = sourceLanguage
    setSourceLanguage(targetLanguage)
    setTargetLanguage(temp)
    setSourceText(translatedText)
    setTranslatedText(sourceText)
  }

  // 复制翻译结果
  const copyTranslation = () => {
    if (translatedText) {
      navigator.clipboard.writeText(translatedText)
      toast({
        title: "已复制",
        description: "翻译结果已复制到剪贴板",
      })
    }
  }

  // 文本转语音
  const speakText = (text: string, lang: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = lang
      window.speechSynthesis.speak(utterance)
    } else {
      toast({
        title: "不支持",
        description: "您的浏览器不支持语音合成",
        variant: "destructive",
      })
    }
  }

  // 处理翻译
  const handleTranslate = async () => {
    if (sourceText.trim() === "") return

    try {
      setIsTranslating(true)
      const result = await translateText({
        text: sourceText,
        sourceLanguage,
        targetLanguage,
      })
      setTranslatedText(result)
    } catch (error) {
      toast({
        title: "翻译失败",
        description: "无法连接到翻译服务，请检查本地LLM是否正常运行",
        variant: "destructive",
      })
      console.error("Translation error:", error)
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      <Tabs defaultValue="translate" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="translate">翻译</TabsTrigger>
          <TabsTrigger value="document">文档翻译</TabsTrigger>
        </TabsList>
        <TabsContent value="translate" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* 源语言面板 */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择源语言" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => speakText(sourceText, sourceLanguage)}
                    disabled={!sourceText}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <span className="text-xs text-muted-foreground">{characterCount}</span>
                </div>
              </div>
              <Textarea
                placeholder="请输入要翻译的文本..."
                className="min-h-[200px] resize-none"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
              />
            </Card>

            {/* 目标语言面板 */}
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="选择目标语言" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        {lang.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => speakText(translatedText, targetLanguage)}
                    disabled={!translatedText}
                  >
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={copyTranslation} disabled={!translatedText}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="relative">
                <Textarea
                  placeholder="翻译结果..."
                  className="min-h-[200px] resize-none"
                  value={translatedText}
                  readOnly
                />
                {isTranslating && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="flex justify-center">
            <Button variant="outline" size="icon" onClick={swapLanguages} className="rounded-full">
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="document" className="space-y-4">
          <DocumentTranslation />
        </TabsContent>
      </Tabs>
    </div>
  )
}
