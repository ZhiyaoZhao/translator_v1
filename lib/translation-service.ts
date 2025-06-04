"use server"

import { generateText } from "ai"
import { createOpenAICompatible } from "@ai-sdk/openai-compatible"
import { getCurrentModelConfig } from "@/config/model-config"

interface TranslationRequest {
  text: string
  sourceLanguage: string
  targetLanguage: string
}

// 语言代码到全名的映射
const languageNames: Record<string, string> = {
  zh: "中文",
  en: "英语",
  ja: "日语",
  ko: "韩语",
  fr: "法语",
  de: "德语",
  es: "西班牙语",
  ru: "俄语",
  ar: "阿拉伯语",
  pt: "葡萄牙语",
  it: "意大利语",
  nl: "荷兰语",
  sv: "瑞典语",
  da: "丹麦语",
  no: "挪威语",
  fi: "芬兰语",
  pl: "波兰语",
  cs: "捷克语",
  hu: "匈牙利语",
  ro: "罗马尼亚语",
}

// 获取模型配置并创建客户端
function createLLMClient() {
  const config = getCurrentModelConfig()

  return createOpenAICompatible({
    name: config.name.toLowerCase().replace(/\s+/g, "-"),
    baseURL: config.baseURL,
    apiKey: config.apiKey,
  })
}

export async function translateText({ text, sourceLanguage, targetLanguage }: TranslationRequest): Promise<string> {
  try {
    const config = getCurrentModelConfig()
    const sourceLangName = languageNames[sourceLanguage] || sourceLanguage
    const targetLangName = languageNames[targetLanguage] || targetLanguage

    // 构建优化的翻译提示词
    const prompt = `你是一个专业的翻译专家。请将以下${sourceLangName}文本准确翻译成${targetLangName}。

要求：
1. 保持原文的意思、语气和风格
2. 确保翻译自然流畅，符合目标语言的表达习惯
3. 对于专业术语，请使用准确的对应词汇
4. 只返回翻译结果，不要包含任何解释或额外内容

原文：
${text}

翻译：`

    const client = createLLMClient()

    const { text: translatedText } = await generateText({
      model: client(config.modelName),
      prompt: prompt,
      maxTokens: config.maxTokens,
      temperature: config.temperature,
    })

    return translatedText.trim()
  } catch (error) {
    console.error("Translation error:", error)

    // 提供更详细的错误信息
    if (error instanceof Error) {
      if (error.message.includes("fetch")) {
        throw new Error("无法连接到翻译服务，请检查本地LLM服务是否正常运行")
      } else if (error.message.includes("timeout")) {
        throw new Error("翻译请求超时，请稍后重试")
      } else {
        throw new Error(`翻译服务错误: ${error.message}`)
      }
    }

    throw new Error("翻译服务出错，请稍后重试")
  }
}

// 获取当前模型信息（用于前端显示）
export async function getModelInfo() {
  const config = getCurrentModelConfig()
  return {
    provider: config.name,
    model: config.modelName,
    baseURL: config.baseURL,
  }
}
