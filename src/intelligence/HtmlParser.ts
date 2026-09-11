/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ContentCleaner } from "./ContentCleaner.ts";

export interface ParsedImage {
  src: string;
  caption: string;
}

export interface ParsedDocument {
  title: string;
  description: string;
  canonicalUrl: string;
  headings: string[];
  paragraphs: string[];
  lists: string[];
  tables: string[];
  codeBlocks: string[];
  images: ParsedImage[];
  videos: string[];
  links: string[];
  metadata: Record<string, string>;
}

export class HtmlParser {
  private cleaner = new ContentCleaner();

  public parse(html: string): ParsedDocument {
    // 1. Fetch metadata first
    const canonicalMatch = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i) ||
                           html.match(/<link[^>]+href="([^"]+)"[^>]+rel="canonical"/i);
    const canonicalUrl = canonicalMatch ? canonicalMatch[1] : "";

    const metadata: Record<string, string> = {};
    const metaRegex = /<meta[^>]+(?:name|property)="([^"]+)"[^>]+content="([^"]+)"/gi;
    let mMatch;
    while ((mMatch = metaRegex.exec(html)) !== null) {
      metadata[mMatch[1]] = mMatch[2];
    }

    const description = metadata["description"] || metadata["og:description"] || "";

    // Extract Title
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? this.decodeEntities(titleMatch[1]).trim() : "Untitled Document";

    // Clean body
    const cleanedBody = this.cleaner.clean(html);

    // 2. Extract Headings (h1 - h6)
    const headings: string[] = [];
    const headingRegex = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
    let hMatch;
    while ((hMatch = headingRegex.exec(cleanedBody)) !== null) {
      const headingText = this.stripTags(hMatch[2]).trim();
      if (headingText && !headings.includes(headingText)) {
        headings.push(this.decodeEntities(headingText));
      }
    }

    // 3. Extract Paragraphs
    const paragraphs: string[] = [];
    const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let pMatch;
    while ((pMatch = pRegex.exec(cleanedBody)) !== null) {
      const pText = this.stripTags(pMatch[1]).trim();
      if (pText.length > 20) {
        paragraphs.push(this.decodeEntities(pText));
      }
    }

    // 4. Extract Lists (ul/ol items)
    const lists: string[] = [];
    const listRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let lMatch;
    while ((lMatch = listRegex.exec(cleanedBody)) !== null) {
      const itemText = this.stripTags(lMatch[1]).trim();
      if (itemText.length > 3 && !lists.includes(itemText)) {
        lists.push(this.decodeEntities(itemText));
      }
    }

    // 5. Extract Code Blocks (pre, code)
    const codeBlocks: string[] = [];
    const codeRegex = /<pre[^>]*>([\s\S]*?)<\/pre>|<code[^>]*>([\s\S]*?)<\/code>/gi;
    let cMatch;
    while ((cMatch = codeRegex.exec(cleanedBody)) !== null) {
      const block = cMatch[1] || cMatch[2];
      if (block) {
        const text = this.stripTags(block).trim();
        if (text.length > 15 && !codeBlocks.includes(text)) {
          codeBlocks.push(text);
        }
      }
    }

    // 6. Extract Tables
    const tables: string[] = [];
    const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
    let tMatch;
    while ((tMatch = tableRegex.exec(cleanedBody)) !== null) {
      const rawTable = tMatch[1];
      const rows: string[] = [];
      const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
      let rMatch;
      while ((rMatch = trRegex.exec(rawTable)) !== null) {
        const rowCells: string[] = [];
        const tdRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
        let cellMatch;
        while ((cellMatch = tdRegex.exec(rMatch[1])) !== null) {
          rowCells.push(this.stripTags(cellMatch[1]).trim());
        }
        if (rowCells.length > 0) {
          rows.push(rowCells.join(" | "));
        }
      }
      if (rows.length > 0) {
        tables.push(rows.join("\n"));
      }
    }

    // 7. Extract Images
    const images: ParsedImage[] = [];
    const imgRegex = /<img[^>]*src="([^"]+)"([^>]*)/gi;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(cleanedBody)) !== null) {
      const src = imgMatch[1];
      const attributes = imgMatch[2];
      
      let caption = "Image Asset";
      const altMatch = attributes.match(/alt="([^"]+)"/i);
      if (altMatch) {
        caption = altMatch[1];
      }

      if (src && !src.startsWith("data:") && !images.some(img => img.src === src)) {
        images.push({ src, caption: this.decodeEntities(caption) });
      }
    }

    // 8. Extract Videos (iframe video sources, video tags)
    const videos: string[] = [];
    const videoRegex = /<video[^>]+src="([^"]+)"|<iframe[^>]+src="([^"]*youtube\.com[^"]*)"/gi;
    let vMatch;
    while ((vMatch = videoRegex.exec(cleanedBody)) !== null) {
      const vSrc = vMatch[1] || vMatch[2];
      if (vSrc && !videos.includes(vSrc)) {
        videos.push(vSrc);
      }
    }

    // 9. Extract Links
    const links: string[] = [];
    const linkRegex = /<a[^>]*href="([^"]+)"/gi;
    let lnkMatch;
    while ((lnkMatch = linkRegex.exec(cleanedBody)) !== null) {
      const href = lnkMatch[1];
      if (href && (href.startsWith("http://") || href.startsWith("https://")) && !links.includes(href)) {
        links.push(href);
      }
    }

    return {
      title,
      description,
      canonicalUrl: canonicalUrl || (metadata["og:url"] || ""),
      headings,
      paragraphs,
      lists,
      tables,
      codeBlocks,
      images,
      videos,
      links,
      metadata
    };
  }

  private stripTags(str: string): string {
    return str.replace(/<[^>]*>/g, "");
  }

  private decodeEntities(str: string): string {
    return str
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
  }
}
