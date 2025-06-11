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
export declare function countMarkdownWords(filePath: string, options?: WordCountOptions): Promise<number>;
/**
 * Get detailed word count statistics
 * @param filePath Path to the Markdown file
 * @param options Configuration options for processing
 * @returns Detailed statistics object
 */
export declare function getDetailedWordCount(filePath: string, options?: WordCountOptions): Promise<{
    totalWords: number;
    chineseChars: number;
    englishWords: number;
    filePath: string;
    options: WordCountOptions;
}>;
//# sourceMappingURL=counter.d.ts.map