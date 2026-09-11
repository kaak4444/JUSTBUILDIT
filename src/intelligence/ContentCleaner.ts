/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class ContentCleaner {
  /**
   * Cleans a raw webpage to yield a highly dense, readable, boilerplate-free document segment,
   * completely optimizing token usage before sending it to the LLM extraction pipeline.
   */
  public clean(html: string): string {
    if (!html) return "";

    let clean = html;

    // 1. Remove code blocks that shouldn't impact semantic facts
    clean = clean.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
    clean = clean.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    clean = clean.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");
    clean = clean.replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, "");
    clean = clean.replace(/<!--[\s\S]*?-->/g, "");

    // 2. Remove prominent cookies / ad containers / banners
    clean = clean.replace(/<div[^>]*(class|id)="[^"]*(cookie|consent|banner|popup|promo|ad-container|advert)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");

    // 3. Strip structural boilerplates (headers, footers, navigations, menus)
    clean = clean.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");
    clean = clean.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "");
    clean = clean.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "");
    clean = clean.replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "");

    // 4. Strip secondary sidebar columns and dynamic widgets
    clean = clean.replace(/<div[^>]*(class|id)="[^"]*(sidebar|navbar|widget|menu-container|navigation|footer-links)[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "");

    // 5. Detect and retain Main Article bodies if available, otherwise fallback
    const articleMatch = clean.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    if (articleMatch && articleMatch[1].length > 200) {
      clean = articleMatch[1];
    } else {
      const mainMatch = clean.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
      if (mainMatch && mainMatch[1].length > 200) {
        clean = mainMatch[1];
      } else {
        const bodyMatch = clean.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch && bodyMatch[1].length > 100) {
          clean = bodyMatch[1];
        }
      }
    }

    // 6. Normalize trailing empty lines and whitespaces
    clean = clean.replace(/\r\n/g, "\n");
    clean = clean.replace(/[ \t]+/g, " ");
    clean = clean.replace(/\n\s*\n+/g, "\n\n");

    return clean.trim();
  }
}
