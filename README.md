# 本地LLM翻译服务

基于Next.js构建的在线翻译应用，支持调用本地部署的大语言模型进行高质量翻译。

## 特性

- 🌐 支持多种语言互译
- 🤖 兼容OpenAI标准接口的本地LLM
- ⚡ 实时翻译，无需手动触发
- 🔄 一键语言交换
- 🔊 文本朗读功能
- 📋 一键复制翻译结果
- ⚙️ 可视化模型配置界面

## 支持的本地部署方案

### 1. Ollama
\`\`\`bash
# 安装Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# 下载模型
ollama pull qwen2.5:7b
ollama pull llama3.1:8b

# 启动服务（默认端口11434）
ollama serve
\`\`\`

### 2. LM Studio
- 下载并安装 [LM Studio](https://lmstudio.ai/)
- 在应用中下载所需模型
- 启动本地服务器（默认端口1234）

### 3. vLLM
\`\`\`bash
# 安装vLLM
pip install vllm

# 启动服务
python -m vllm.entrypoints.openai.api_server \
  --model Qwen/Qwen2.5-7B-Instruct \
  --port 8000
\`\`\`

### 4. Text Generation WebUI
\`\`\`bash
# 克隆仓库
git clone https://github.com/oobabooga/text-generation-webui
cd text-generation-webui

# 安装依赖
pip install -r requirements.txt

# 启动服务（启用API模式）
python server.py --api --listen
\`\`\`

## 环境变量配置

创建 `.env.local` 文件：

\`\`\`env
# LLM API配置
LLM_API_BASE_URL=http://localhost:11434/v1
LLM_API_KEY=ollama
LLM_MODEL_NAME=qwen2.5:7b
\`\`\`

## 安装和运行

\`\`\`bash
# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build
npm start
\`\`\`

## 使用说明

1. **配置模型**：在"模型配置"标签页中设置您的本地LLM服务信息
2. **测试连接**：点击"测试连接"确保模型服务正常
3. **开始翻译**：在翻译界面输入文本，系统会自动进行翻译

## API接口

### POST /api/translate
翻译文本接口

\`\`\`json
{
  "text": "要翻译的文本",
  "sourceLanguage": "zh",
  "targetLanguage": "en"
}
\`\`\`

### POST /api/test-model
测试模型连接

\`\`\`json
{
  "baseURL": "http://localhost:11434/v1",
  "apiKey": "ollama",
  "modelName": "qwen2.5:7b"
}
\`\`\`

## 技术栈

- **前端框架**：Next.js 14 (App Router)
- **UI组件**：shadcn/ui + Tailwind CSS
- **AI集成**：Vercel AI SDK
- **类型安全**：TypeScript
- **状态管理**：React Hooks

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License
