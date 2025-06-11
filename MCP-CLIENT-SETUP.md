# MCP客户端配置指南

## 概述

这个指南将帮助你在各种支持MCP协议的客户端中配置和使用Markdown字数统计服务器。

## 前提条件

1. 确保已经构建了MCP服务器：
   ```bash
   npm install
   npm run build
   ```

2. 记录服务器的完整路径：
   ```
   d:\11_WorkSpace\markdown-word-counter-mcp\build\index.js
   ```

## 配置方法

### 1. Claude Desktop (Anthropic)

在Claude Desktop的配置文件中添加：

**Windows路径**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS路径**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "markdown-word-counter": {
      "command": "node",
      "args": [
        "d:/11_WorkSpace/markdown-word-counter-mcp/build/index.js"
      ],
      "env": {}
    }
  }
}
```

### 2. Continue.dev

在Continue配置文件 (`~/.continue/config.json`) 中添加：

```json
{
  "mcpServers": [
    {
      "name": "markdown-word-counter",
      "command": "node",
      "args": [
        "d:/11_WorkSpace/markdown-word-counter-mcp/build/index.js"
      ]
    }
  ]
}
```

### 3. Cline (VSCode Extension)

在Cline的设置中添加MCP服务器配置：

```json
{
  "cline.mcpServers": {
    "markdown-word-counter": {
      "command": "node",
      "args": [
        "d:/11_WorkSpace/markdown-word-counter-mcp/build/index.js"
      ]
    }
  }
}
```

### 4. 其他MCP客户端

对于其他支持MCP协议的客户端，通常需要在配置文件中添加类似的配置：

```json
{
  "name": "markdown-word-counter",
  "command": "node",
  "args": ["d:/11_WorkSpace/markdown-word-counter-mcp/build/index.js"]
}
```

## 使用方法

配置完成后，在支持的客户端中可以使用以下工具：

### count_words - 基础字数统计

```
请使用markdown-word-counter工具统计这个文件的字数：document.md
```

或者指定选项：
```
请使用markdown-word-counter工具统计document.md的字数，需要移除HTML标签和Markdown标题
```

### detailed_word_count - 详细统计

```
请使用markdown-word-counter工具获取document.md的详细字数统计
```

## 工具参数说明

### 基础调用
```json
{
  "file_path": "document.md"
}
```

### 启用特定处理选项
```json
{
  "file_path": "document.md",
  "remove_html_tags": true,
  "process_markdown_links": true,
  "remove_markdown_headers": true,
  "remove_markdown_lists": true
}
```

## 默认行为

- **默认只规范化空白字符** - 多个空格/换行合并为单个空格
- **保留所有内容** - HTML标签、Markdown语法、链接URL等都会被计入字数
- **分别统计中英文** - 中文字符和英文单词分开计算

## 故障排除

### 1. 服务器无法启动
- 检查Node.js是否已安装 (`node --version`)
- 确认文件路径正确
- 检查是否已运行 `npm run build`

### 2. 客户端无法找到工具
- 重启客户端应用
- 检查配置文件语法是否正确
- 查看客户端的错误日志

### 3. 文件路径问题
- 使用绝对路径
- Windows用户注意使用正斜杠 `/` 或双反斜杠 `\\`
- 确保文件存在且可读

## 测试配置

可以创建一个简单的测试文件来验证配置：

**test.md**:
```markdown
# 测试 Test

这是一个测试文件。This is a test file.

- 列表项 List item
- 另一项 Another item
```

然后在客户端中请求：
```
请使用markdown-word-counter工具统计test.md的字数
```

预期结果应该显示中文字符和英文单词的分别统计。

## 高级用法

### 批量处理
```
请使用markdown-word-counter工具分别统计以下文件的字数：
1. document1.md
2. document2.md  
3. document3.md
```

### 对比不同处理选项
```
请使用markdown-word-counter工具对同一个文件进行两次统计：
1. 使用默认设置
2. 启用所有处理选项
然后对比结果差异
```
