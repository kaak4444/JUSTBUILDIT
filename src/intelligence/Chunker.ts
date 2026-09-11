/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ParsedDocument } from "./HtmlParser.ts";

export interface DocumentChunk {
  id: string;
  text: string;
  charCount: number;
  position: number;
}

export class Chunker {
  private chunkSizeChars = 3500; // Roughly 800-900 tokens
  private chunkOverlapChars = 400;  // Roughly 100 tokens

  public chunk(doc: ParsedDocument, docUrl: string): DocumentChunk[] {
    console.log(`[Chunker] Segmenting document: "${doc.title}"`);
    
    // Assemble the text content in a logical sequence to maintain integrity
    const contentBlocks: string[] = [];
    contentBlocks.push(`Document Title: ${doc.title}`);
    contentBlocks.push(`Source URL: ${docUrl}`);
    
    if (doc.headings.length > 0) {
      contentBlocks.push(`Main Topics: ${doc.headings.join(", ")}`);
    }

    // Append tables as self-contained blocks
    for (const table of doc.tables) {
      contentBlocks.push(`Table Data Structure:\n${table}`);
    }

    // Append paragraph flows
    for (const p of doc.paragraphs) {
      contentBlocks.push(p);
    }

    const fullText = contentBlocks.join("\n\n");
    const chunks: DocumentChunk[] = [];
    
    if (fullText.length <= this.chunkSizeChars) {
      chunks.push({
        id: `chunk_${Date.now()}_0`,
        text: fullText,
        charCount: fullText.length,
        position: 0
      });
      return chunks;
    }

    let start = 0;
    let index = 0;
    
    while (start < fullText.length) {
      let end = start + this.chunkSizeChars;
      
      // Try to break at double newline or single newline to keep structures intact
      if (end < fullText.length) {
        const doubleNewline = fullText.lastIndexOf("\n\n", end);
        if (doubleNewline > start + this.chunkSizeChars * 0.5) {
          end = doubleNewline;
        } else {
          const singleNewline = fullText.lastIndexOf("\n", end);
          if (singleNewline > start + this.chunkSizeChars * 0.5) {
            end = singleNewline;
          }
        }
      }

      const chunkText = fullText.substring(start, end).trim();
      chunks.push({
        id: `chunk_${Date.now()}_${index}`,
        text: chunkText,
        charCount: chunkText.length,
        position: index
      });

      start = end - this.chunkOverlapChars;
      if (start < 0) start = end;
      if (end >= fullText.length) break;
      index++;
    }

    console.log(`[Chunker] Successfully split document into ${chunks.length} chunks.`);
    return chunks;
  }

  public chunkMany(docs: { doc: ParsedDocument; url: string }[]): DocumentChunk[] {
    const allChunks: DocumentChunk[] = [];
    for (const item of docs) {
      allChunks.push(...this.chunk(item.doc, item.url));
    }
    return allChunks;
  }
}
