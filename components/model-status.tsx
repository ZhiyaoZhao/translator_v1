"use client"

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Info, CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface ModelInfo {
  provider: string
  model: string
  baseURL: string
}

export default function ModelStatus() {
  const [modelInfo, setModelInfo] = useState<ModelInfo | null>(null)
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")

  useEffect(() => {
    fetchModelInfo()
  }, [])

  const fetchModelInfo = async () => {
    try {
      const response = await fetch("/api/model-info")
      if (response.ok) {
        const info = await response.json()
        setModelInfo(info)
        setStatus("connected")
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Failed to fetch model info:", error)
      setStatus("error")
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-3 w-3" />
      case "error":
        return <XCircle className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-yellow-500"
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "已连接"
      case "error":
        return "连接失败"
      default:
        return "检查中"
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <Badge variant="outline" className={`${getStatusColor()} text-white border-none`}>
            {getStatusIcon()}
            <span className="ml-1">{getStatusText()}</span>
          </Badge>
          <Info className="h-4 w-4 ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-3">
          <h4 className="font-medium leading-none">模型状态</h4>
          {modelInfo ? (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">服务提供商:</span>
                <span className="font-medium">{modelInfo.provider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">模型名称:</span>
                <span className="font-medium">{modelInfo.model}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">API地址:</span>
                <span className="font-medium text-xs">{modelInfo.baseURL}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">连接状态:</span>
                <Badge variant={status === "connected" ? "default" : "destructive"} className="text-xs">
                  {getStatusIcon()}
                  <span className="ml-1">{getStatusText()}</span>
                </Badge>
              </div>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              {status === "error" ? "无法获取模型信息" : "正在获取模型信息..."}
            </div>
          )}
          <Button variant="outline" size="sm" onClick={fetchModelInfo} className="w-full">
            刷新状态
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
