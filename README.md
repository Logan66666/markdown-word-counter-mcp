# Markdown Word Counter MCP Server

A Model Context Protocol (MCP) server that provides word counting functionality for Markdown files, with support for both Chinese characters and English words.

## Features

- **Accurate Word Counting**: Properly handles both Chinese characters and English words
- **Minimal Processing by Default**: Only normalizes whitespace, preserves all content
- **Configurable Processing**: Control what gets processed with flexible options
- **Markdown-Aware**: Optionally removes Markdown syntax while preserving content
- **HTML Tag Removal**: Optionally strips HTML tags from content
- **Link Processing**: Optionally extracts text from Markdown links
- **Two Tools Available**:
  - `count_words`: Get total word count with options
  - `detailed_word_count`: Get detailed statistics with processing info

## Processing Options

By default, only whitespace is normalized. All other processing is optional:

- **remove_html_tags** (default: false) - Remove HTML tags like `<div>`, `<p>`
- **process_markdown_links** (default: false) - Extract text from `[text](url)` links
- **remove_markdown_headers** (default: false) - Remove header markers `#`, `##`, etc.
- **remove_markdown_lists** (default: false) - Remove list markers `-`, `*`, `+`
- **normalize_whitespace** (default: true) - Collapse multiple spaces/newlines

## Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Usage

### As MCP Server

Add to your MCP client configuration (e.g., `mcp_settings.json`):

```json
{
  "mcpServers": {
    "markdown-word-counter": {
      "command": "node",
      "args": [
        "/path/to/markdown-word-counter-mcp/build/index.js"
      ]
    }
  }
}
```

### Available Tools

#### count_words
Count total words in a Markdown file.

**Parameters:**
- `file_path` (string, required): Path to the Markdown file
- `remove_html_tags` (boolean, optional): Remove HTML tags (default: false)
- `process_markdown_links` (boolean, optional): Process Markdown links (default: false)
- `remove_markdown_headers` (boolean, optional): Remove headers (default: false)
- `remove_markdown_lists` (boolean, optional): Remove list markers (default: false)
- `normalize_whitespace` (boolean, optional): Normalize whitespace (default: true)

**Example (Default - Minimal Processing):**
```json
{
  "file_path": "document.md"
}
```

**Example (Enable All Processing):**
```json
{
  "file_path": "document.md",
  "remove_html_tags": true,
  "process_markdown_links": true,
  "remove_markdown_headers": true,
  "remove_markdown_lists": true
}
```

#### detailed_word_count
Get detailed word count statistics with processing information.

**Parameters:**
- Same as `count_words`

**Example:**
```json
{
  "file_path": "document.md",
  "remove_markdown_headers": false
}
```

### Standalone Usage

You can also run the server directly:

```bash
npm start
```

## Development

- `npm run dev`: Watch mode for development
- `npm run build`: Build the TypeScript code
- `npm start`: Run the built server

## Word Counting Logic

The server uses the following logic to count words:

1. **Remove HTML tags**: Strips all HTML markup
2. **Process Markdown links**: Extracts link text, removes URLs
3. **Remove Markdown syntax**: Headers (`#`), lists (`-`, `*`, `+`)
4. **Normalize whitespace**: Collapses multiple spaces
5. **Count separately**:
   - Chinese characters: Using Unicode range `[\u4e00-\u9fa5]`
   - English words: Using word boundaries `\b\w+\b`
6. **Sum totals**: Chinese chars + English words = Total words

## Examples

### Default Processing (Minimal - Only Normalize Whitespace)
For a file containing:
```markdown
# Hello 世界

This is a [link](http://example.com) with **bold** text.

- 中文测试
- English test
```

Default result (preserves all Markdown syntax):
- Chinese Characters: 4 (世界中文测试)
- English Words: 13 (Hello This is a link http example com with bold text English test)
- Total Words: 17

### Full Processing (All Options Enabled)
Same file with all processing enabled:
```json
{
  "file_path": "document.md",
  "remove_html_tags": true,
  "process_markdown_links": true,
  "remove_markdown_headers": true,
  "remove_markdown_lists": true,
  "normalize_whitespace": true
}
```

Result with full processing:
- Chinese Characters: 4 (世界中文测试)
- English Words: 7 (Hello This is a link with bold text English test)
- Total Words: 11

## License

MIT
