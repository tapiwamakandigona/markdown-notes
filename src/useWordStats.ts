import { useMemo } from "react";

interface WordStats {
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
  sentenceCount: number;
  paragraphCount: number;
  readingTime: number; // minutes
  topWords: Array<{ word: string; count: number }>;
  avgWordLength: number;
}

const STOP_WORDS = new Set([
  "the", "a", "an", "is", "are", "was", "were", "be", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "shall",
  "should", "may", "might", "must", "can", "could", "of", "at", "by",
  "for", "with", "about", "against", "between", "through", "during",
  "before", "after", "above", "below", "to", "from", "up", "down",
  "in", "out", "on", "off", "over", "under", "again", "further",
  "then", "once", "here", "there", "when", "where", "why", "how",
  "all", "both", "each", "few", "more", "most", "other", "some",
  "such", "no", "nor", "not", "only", "own", "same", "so", "than",
  "too", "very", "just", "because", "as", "until", "while", "and",
  "but", "or", "if", "it", "its", "this", "that", "these", "those",
  "i", "me", "my", "we", "our", "you", "your", "he", "him", "his",
  "she", "her", "they", "them", "their", "what", "which", "who",
]);

/**
 * Calculate comprehensive word statistics for a text.
 * Includes reading time, word frequency, and readability metrics.
 */
export function useWordStats(text: string): WordStats {
  return useMemo(() => {
    if (!text.trim()) {
      return {
        wordCount: 0, charCount: 0, charCountNoSpaces: 0,
        sentenceCount: 0, paragraphCount: 0, readingTime: 0,
        topWords: [], avgWordLength: 0,
      };
    }

    const words = text.split(/\s+/).filter(Boolean);
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s/g, "").length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    const readingTime = Math.max(1, Math.ceil(words.length / 200)); // 200 WPM

    // Word frequency (excluding stop words and markdown syntax)
    const freq: Record<string, number> = {};
    words.forEach(w => {
      const clean = w.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (clean.length > 2 && !STOP_WORDS.has(clean)) {
        freq[clean] = (freq[clean] || 0) + 1;
      }
    });

    const topWords = Object.entries(freq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));

    const avgWordLength = words.length > 0
      ? words.reduce((sum, w) => sum + w.length, 0) / words.length
      : 0;

    return {
      wordCount: words.length,
      charCount,
      charCountNoSpaces,
      sentenceCount: sentences.length,
      paragraphCount: paragraphs.length,
      readingTime,
      topWords,
      avgWordLength: Math.round(avgWordLength * 10) / 10,
    };
  }, [text]);
}
