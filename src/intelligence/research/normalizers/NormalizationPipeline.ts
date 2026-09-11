/* ==========================================================
   JUSTBUILDIT - RESEARCH CORE V3
   DETERMINISTIC NORMALIZATION PIPELINE
   ========================================================== */

import { RawDocument, NormalizedDocument } from "../core/types";

export class NormalizationPipelineV3 {
    
    /**
     * Entry point to normalize a raw collected document.
     * Sequentially applies non-LLM, high-speed deterministic algorithms.
     */
    static normalize(doc: RawDocument): NormalizedDocument {
        // 1. Cleaner: Strips weird HTML elements or markdown artifacts
        let content = doc.markdown || (doc.json ? JSON.stringify(doc.json) : doc.html || "");
        content = this.cleanText(content);

        // 2. Boilerplate Remover: Removes standard repeating headers/footers
        content = this.removeBoilerplate(content);

        // 3. Language Detector: Matches unicode blocks & word clues
        const language = this.detectLanguage(content);

        // 4. Duplicate Detector: Create robust content hash
        const duplicateHash = this.generateHash(content);

        // 5. Metadata Extractor & Reading Time
        const readingTime = Math.max(1, Math.round(content.split(/\s+/).length / 225));
        
        // Simple regex-based sentiment index [-1 to 1]
        const sentiment = this.estimateSentiment(content);

        return {
            id: `norm_${doc.id.replace("raw_", "")}`,
            rawDocumentId: doc.id,
            source: doc.source,
            url: doc.url,
            title: doc.metadata.title || `Collected Trace from ${doc.source}`,
            cleanedContent: content,
            language,
            boilerplateRemoved: true,
            duplicateHash,
            isCanonical: true, // Mark canonical by default
            metadata: {
                author: doc.metadata.author || "Web Collector",
                datePublished: doc.metadata.date || new Date().toISOString().split("T")[0],
                readingTimeMinutes: readingTime,
                sentimentScore: sentiment
            },
            processedAt: Date.now()
        };
    }

    private static cleanText(text: string): string {
        return text
            .replace(/[\r\n]+/g, "\n") // Clean multiple newlines
            .replace(/<!--[\s\S]*?-->/g, "") // Strip HTML comments
            .replace(/\s+/g, " ") // Clean multiple whitespaces
            .trim();
    }

    private static removeBoilerplate(text: string): string {
        // Remove typical terms of service links, privacy policies or footer boilerplate
        return text
            .replace(/Terms of Service|Privacy Policy|All Rights Reserved|Copyright © \d{4}/gi, "")
            .replace(/Click here to register|Sign in to view comments/gi, "");
    }

    private static detectLanguage(text: string): string {
        // Extremely fast char-block evaluation
        const cyrillicPattern = /[\u0400-\u04FF]/;
        const asianPattern = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/;
        
        if (asianPattern.test(text)) return "JA/ZH";
        if (cyrillicPattern.test(text)) return "RU";
        return "EN"; // default English
    }

    private static generateHash(text: string): string {
        let hash = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash |= 0; // Convert to 32bit integer
        }
        return `hash_${Math.abs(hash).toString(16)}`;
    }

    private static estimateSentiment(text: string): number {
        const lower = text.toLowerCase();
        const positiveWords = ["awesome", "stellar", "love", "fantastic", "clean", "perfect", "great", "easy", "robust"];
        const negativeWords = ["hate", "blinding", "awful", "cluttered", "expensive", "steep", "broken", "frustrating", "bad"];

        let posCount = 0;
        let negCount = 0;

        positiveWords.forEach(w => {
            const matches = lower.match(new RegExp(w, "g"));
            if (matches) posCount += matches.length;
        });

        negativeWords.forEach(w => {
            const matches = lower.match(new RegExp(w, "g"));
            if (matches) negCount += matches.length;
        });

        const total = posCount + negCount;
        if (total === 0) return 0;
        return Number(((posCount - negCount) / total).toFixed(2));
    }
}
