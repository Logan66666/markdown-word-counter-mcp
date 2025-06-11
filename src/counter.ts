import { readFile } from 'fs/promises';

export interface WordCountOptions {
    /** Whether to remove HTML tags (default: false) */
    removeHtmlTags?: boolean;
    /** Whether to process Markdown links (default: false) */
    processMarkdownLinks?: boolean;
    /** Whether to remove Markdown headers (default: false) */
    removeMarkdownHeaders?: boolean;
    /** Whether to remove Markdown list markers (default: false) */
    removeMarkdownLists?: boolean;
    /** Whether to normalize whitespace (default: true) */
    normalizeWhitespace?: boolean;
}

/**
 * Count words in a Markdown file, supporting both Chinese characters and English words
 * @param filePath Path to the Markdown file
 * @param options Configuration options for processing
 * @returns Total word count
 */
export async function countMarkdownWords(filePath: string, options: WordCountOptions = {}): Promise<number> {
    try {
        const content = await readFile(filePath, 'utf-8');

        // Set default options - only normalize whitespace by default
        const {
            removeHtmlTags = false,
            processMarkdownLinks = false,
            removeMarkdownHeaders = false,
            removeMarkdownLists = false,
            normalizeWhitespace = true
        } = options;

        // Define regex patterns
        const htmlTagPattern = /<.*?>/g;                    // HTML tags
        const markdownLinkPattern = /\[([^\]]+)\]\([^)]+\)/g; // Markdown links (keep text)
        const markdownHeaderPattern = /#+\s*/g;             // Header markers
        const markdownListPattern = /[-*+]\s/g;             // List markers

        let cleaned = content;

        // Remove HTML tags (optional)
        if (removeHtmlTags) {
            cleaned = cleaned.replace(htmlTagPattern, '');
        }

        // Process Markdown links (optional, keep link text only)
        if (processMarkdownLinks) {
            cleaned = cleaned.replace(markdownLinkPattern, '$1');
        }

        // Remove Markdown markers (optional)
        if (removeMarkdownHeaders) {
            cleaned = cleaned.replace(markdownHeaderPattern, '');
        }
        if (removeMarkdownLists) {
            cleaned = cleaned.replace(markdownListPattern, '');
        }

        // Normalize whitespace (optional)
        if (normalizeWhitespace) {
            cleaned = cleaned.replace(/\s+/g, ' ').trim();
        }
        
        // Count Chinese characters and English words
        const chineseChars = (cleaned.match(/[\u4e00-\u9fa5]/g) || []).length;
        // Remove Chinese characters first to avoid double counting
        const cleanedWithoutChinese = cleaned.replace(/[\u4e00-\u9fa5]/g, '');
        const englishWords = (cleanedWithoutChinese.match(/\b\w+\b/g) || []).length;
        
        return chineseChars + englishWords;
        
    } catch (error) {
        throw new Error(`Failed to count words in ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
}

/**
 * Get detailed word count statistics
 * @param filePath Path to the Markdown file
 * @param options Configuration options for processing
 * @returns Detailed statistics object
 */
export async function getDetailedWordCount(filePath: string, options: WordCountOptions = {}): Promise<{
    totalWords: number;
    chineseChars: number;
    englishWords: number;
    filePath: string;
    options: WordCountOptions;
}> {
    try {
        const content = await readFile(filePath, 'utf-8');

        // Set default options - only normalize whitespace by default
        const {
            removeHtmlTags = false,
            processMarkdownLinks = false,
            removeMarkdownHeaders = false,
            removeMarkdownLists = false,
            normalizeWhitespace = true
        } = options;

        // Apply same cleaning logic with options
        let cleaned = content;

        if (removeHtmlTags) {
            cleaned = cleaned.replace(/<.*?>/g, '');
        }
        if (processMarkdownLinks) {
            cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
        }
        if (removeMarkdownHeaders) {
            cleaned = cleaned.replace(/#+\s*/g, '');
        }
        if (removeMarkdownLists) {
            cleaned = cleaned.replace(/[-*+]\s/g, '');
        }
        if (normalizeWhitespace) {
            cleaned = cleaned.replace(/\s+/g, ' ').trim();
        }

        const chineseChars = (cleaned.match(/[\u4e00-\u9fa5]/g) || []).length;
        // Remove Chinese characters first to avoid double counting
        const cleanedWithoutChinese = cleaned.replace(/[\u4e00-\u9fa5]/g, '');
        const englishWords = (cleanedWithoutChinese.match(/\b\w+\b/g) || []).length;
        const totalWords = chineseChars + englishWords;

        return {
            totalWords,
            chineseChars,
            englishWords,
            filePath,
            options
        };
        
    } catch (error) {
        throw new Error(`Failed to get detailed word count for ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
}
