# 模型配置说明

## 配置方式

模型配置通过环境变量和配置文件进行管理，支持多种本地LLM部署方案。

## 环境变量

在项目根目录创建 `.env.local` 文件：

\`\`\`env
# 选择模型提供商
LLM_PROVIDER=ollama

# 自定义配置（当LLM_PROVIDER=custom时使用）
LLM_API_BASE_URL=http://localhost:11434/v1
LLM_API_KEY=ollama
LLM_MODEL_NAME=qwen2.5:7b
LLM_MAX_TOKENS=2000
LLM_TEMPERATURE=0.3
\`\`\`

## 预设配置

### 1. Ollama (推荐)
\`\`\`env
LLM_PROVIDER=ollama
\`\`\`

默认配置：
- API地址: `http://localhost:11434/v1`
- 模型: `qwen2.5:7b`

安装和使用：
\`\`\`bash
# 安装Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 下载模型
ollama pull qwen2.5:7b

# 启动服务
ollama serve
\`\`\`

### 2. LM Studio
\`\`\`env
LLM_PROVIDER=lmstudio
\`\`\`

默认配置：
- API地址: `http://localhost:1234/v1`
- 模型: `llama-3.2-1b`

### 3. vLLM
\`\`\`env
LLM_PROVIDER=vllm
\`\`\`

默认配置：
- API地址: `http://localhost:8000/v1`
- 模型: `Qwen/Qwen2.5-7B-Instruct`

启动命令：
\`\`\`bash
python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen2.5-7B-Instruct \
  --port 8000
\`\`\`

### 4. Text Generation WebUI
\`\`\`env
LLM_PROVIDER=webui
\`\`\`

默认配置：
- API地址: `http://localhost:5000/v1`
- 模型: `custom-model`

### 5. 自定义配置
\`\`\`env
LLM_PROVIDER=custom
LLM_API_BASE_URL=http://your-server:port/v1
LLM_API_KEY=your-api-key
LLM_MODEL_NAME=your-model-name
\`\`\`

## 修改配置

要修改模型配置，请编辑 `config/model-config.ts` 文件：

\`\`\`typescript
export const modelConfigs: Record<string, ModelConfig> = {
  // 添加新的配置
  myconfig: {
    name: "My Custom Config",
    baseURL: "http://localhost:9000/v1",
    apiKey: "my-key",
    modelName: "my-model",
    maxTokens: 4000,
    temperature: 0.1,
  },
}
\`\`\`

然后设置环境变量：
\`\`\`env
LLM_PROVIDER=myconfig
\`\`\`

## 参数说明

- **baseURL**: OpenAI兼容API的基础URL
- **apiKey**: API密钥（某些本地部署可能不需要真实密钥）
- **modelName**: 模型名称
- **maxTokens**: 最大生成token数量
- **temperature**: 生成温度（0-1，越低越确定性）

## 故障排除

1. **连接失败**: 检查API地址和端口是否正确
2. **模型不存在**: 确认模型名称是否正确
3. **权限错误**: 检查API密钥是否有效
4. **超时错误**: 增加maxTokens或检查网络连接
