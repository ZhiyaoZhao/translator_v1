// 文件处理工具函数

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getFileIcon(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "pdf":
      return "📄"
    case "doc":
    case "docx":
      return "📝"
    case "txt":
      return "📃"
    case "md":
      return "📋"
    case "rtf":
      return "📄"
    default:
      return "📁"
  }
}

export function validateFileType(fileName: string, allowedTypes: string[]): boolean {
  const extension = "." + fileName.split(".").pop()?.toLowerCase()
  return allowedTypes.includes(extension)
}

export function validateFileSize(fileSize: number, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return fileSize <= maxSizeBytes
}
