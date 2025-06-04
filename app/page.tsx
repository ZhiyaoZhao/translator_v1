import TranslationInterface from "@/components/translation-interface"
import ModelStatus from "@/components/model-status"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "在线翻译 | 本地LLM翻译服务",
  description: "使用本地部署的大语言模型进行高质量翻译",
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-xl">本地LLM翻译</span>
          </div>
          <ModelStatus />
        </div>
      </header>
      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="flex max-w-[980px] flex-col items-start gap-2">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">高质量机器翻译</h1>
            <p className="text-lg text-muted-foreground">基于本地部署的大语言模型，提供准确、流畅的多语言翻译服务</p>
          </div>
          <TranslationInterface />
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground">© 2025 本地LLM翻译. 保留所有权利.</p>
        </div>
      </footer>
    </div>
  )
}
