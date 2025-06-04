// 模型配置文件
export interface ModelConfig {
  name: string
  baseURL: string
  apiKey: string
  modelName: string
  maxTokens: number
  temperature: number
}

// 预设的模型配置
export const modelConfigs: Record<string, ModelConfig> = {
  ollama: {
    name: "Ollama",
    baseURL: "http://localhost:11434/v1",
    apiKey: "ollama",
    modelName: "qwen2.5:7b",
    maxTokens: 2000,
    temperature: 0.3,
  },
  lmstudio: {
    name: "LM Studio",
    baseURL: "http://localhost:1234/v1",
    apiKey: "lm-studio",
    modelName: "llama-3.2-1b",
    maxTokens: 2000,
    temperature: 0.3,
  },
  vllm: {
    name: "vLLM",
    baseURL: "http://localhost:8000/v1",
    apiKey: "vllm",
    modelName: "Qwen/Qwen2.5-7B-Instruct",
    maxTokens: 2000,
    temperature: 0.3,
  },
  webui: {
    name: "Text Generation WebUI",
    baseURL: "http://localhost:5000/v1",
    apiKey: "webui",
    modelName: "custom-model",
    maxTokens: 2000,
    temperature: 0.3,
  },
  custom: {
    name: "Custom",
    baseURL: process.env.LLM_API_BASE_URL || "http://localhost:11434/v1",
    apiKey: process.env.LLM_API_KEY || "ollama",
    modelName: process.env.LLM_MODEL_NAME || "qwen2.5:7b",
    maxTokens: Number.parseInt(process.env.LLM_MAX_TOKENS || "2000"),
    temperature: Number.parseFloat(process.env.LLM_TEMPERATURE || "0.3"),
  },
}

// 获取当前使用的模型配置
export function getCurrentModelConfig(): ModelConfig {
  const configName = process.env.LLM_PROVIDER || "ollama"
  return modelConfigs[configName] || modelConfigs.ollama
}
