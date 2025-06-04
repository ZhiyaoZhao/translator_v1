export const env = {
  // 本地部署的LLM API基础URL（OpenAI兼容接口）
  LLM_API_BASE_URL: process.env.LLM_API_BASE_URL || "http://localhost:11434/v1",
  // LLM API密钥（某些本地部署可能不需要）
  LLM_API_KEY: process.env.LLM_API_KEY || "ollama",
  // 使用的模型名称
  LLM_MODEL_NAME: process.env.LLM_MODEL_NAME || "qwen2.5:7b",
}
