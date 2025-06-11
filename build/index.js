#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { countMarkdownWords, getDetailedWordCount } from './counter.js';
class MarkdownWordCounterServer {
    server;
    constructor() {
        this.server = new Server({
            name: 'markdown-word-counter',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.setupToolHandlers();
        this.setupErrorHandling();
    }
    setupErrorHandling() {
        this.server.onerror = (error) => {
            console.error('[MCP Error]', error);
        };
        process.on('SIGINT', async () => {
            await this.server.close();
            process.exit(0);
        });
    }
    setupToolHandlers() {
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    {
                        name: 'count_words',
                        description: 'Count total words in a Markdown file (supports Chinese characters and English words)',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                file_path: {
                                    type: 'string',
                                    description: 'Path to the Markdown file to analyze',
                                },
                                remove_html_tags: {
                                    type: 'boolean',
                                    description: 'Whether to remove HTML tags (default: false)',
                                    default: false,
                                },
                                process_markdown_links: {
                                    type: 'boolean',
                                    description: 'Whether to process Markdown links (default: false)',
                                    default: false,
                                },
                                remove_markdown_headers: {
                                    type: 'boolean',
                                    description: 'Whether to remove Markdown headers (default: false)',
                                    default: false,
                                },
                                remove_markdown_lists: {
                                    type: 'boolean',
                                    description: 'Whether to remove Markdown list markers (default: false)',
                                    default: false,
                                },
                                normalize_whitespace: {
                                    type: 'boolean',
                                    description: 'Whether to normalize whitespace (default: true)',
                                    default: true,
                                },
                            },
                            required: ['file_path'],
                        },
                    },
                    {
                        name: 'detailed_word_count',
                        description: 'Get detailed word count statistics for a Markdown file',
                        inputSchema: {
                            type: 'object',
                            properties: {
                                file_path: {
                                    type: 'string',
                                    description: 'Path to the Markdown file to analyze',
                                },
                                remove_html_tags: {
                                    type: 'boolean',
                                    description: 'Whether to remove HTML tags (default: false)',
                                    default: false,
                                },
                                process_markdown_links: {
                                    type: 'boolean',
                                    description: 'Whether to process Markdown links (default: false)',
                                    default: false,
                                },
                                remove_markdown_headers: {
                                    type: 'boolean',
                                    description: 'Whether to remove Markdown headers (default: false)',
                                    default: false,
                                },
                                remove_markdown_lists: {
                                    type: 'boolean',
                                    description: 'Whether to remove Markdown list markers (default: false)',
                                    default: false,
                                },
                                normalize_whitespace: {
                                    type: 'boolean',
                                    description: 'Whether to normalize whitespace (default: true)',
                                    default: true,
                                },
                            },
                            required: ['file_path'],
                        },
                    },
                ],
            };
        });
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            try {
                if (name === 'count_words') {
                    const { file_path, remove_html_tags, process_markdown_links, remove_markdown_headers, remove_markdown_lists, normalize_whitespace } = args;
                    const options = {
                        removeHtmlTags: remove_html_tags,
                        processMarkdownLinks: process_markdown_links,
                        removeMarkdownHeaders: remove_markdown_headers,
                        removeMarkdownLists: remove_markdown_lists,
                        normalizeWhitespace: normalize_whitespace
                    };
                    const wordCount = await countMarkdownWords(file_path, options);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Total Words: ${wordCount}`,
                            },
                        ],
                    };
                }
                if (name === 'detailed_word_count') {
                    const { file_path, remove_html_tags, process_markdown_links, remove_markdown_headers, remove_markdown_lists, normalize_whitespace } = args;
                    const options = {
                        removeHtmlTags: remove_html_tags,
                        processMarkdownLinks: process_markdown_links,
                        removeMarkdownHeaders: remove_markdown_headers,
                        removeMarkdownLists: remove_markdown_lists,
                        normalizeWhitespace: normalize_whitespace
                    };
                    const stats = await getDetailedWordCount(file_path, options);
                    return {
                        content: [
                            {
                                type: 'text',
                                text: `Detailed Word Count for: ${stats.filePath}
Total Words: ${stats.totalWords}
Chinese Characters: ${stats.chineseChars}
English Words: ${stats.englishWords}

Processing Options:
- Remove HTML Tags: ${stats.options.removeHtmlTags ?? false}
- Process Markdown Links: ${stats.options.processMarkdownLinks ?? false}
- Remove Markdown Headers: ${stats.options.removeMarkdownHeaders ?? false}
- Remove Markdown Lists: ${stats.options.removeMarkdownLists ?? false}
- Normalize Whitespace: ${stats.options.normalizeWhitespace ?? true}`,
                            },
                        ],
                    };
                }
                throw new Error(`Unknown tool: ${name}`);
            }
            catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Error: ${errorMessage}`,
                        },
                    ],
                    isError: true,
                };
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('Markdown Word Counter MCP server running on stdio');
    }
}
const server = new MarkdownWordCounterServer();
server.run().catch(console.error);
//# sourceMappingURL=index.js.map