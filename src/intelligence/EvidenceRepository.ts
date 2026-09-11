/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Evidence } from "./types.ts";
import fs from "fs";
import path from "path";

export class EvidenceRepository {
  private dbPath = path.join(process.cwd(), "data", "db.json");

  public async save(evidence: Evidence): Promise<void> {
    console.log(`[EvidenceRepository] Storing evidence item: ${evidence.id} (${evidence.source})`);
    
    let dbContent: any = { logs: [], researchStore: {}, evidenceList: [] };
    if (fs.existsSync(this.dbPath)) {
      try {
        dbContent = JSON.parse(fs.readFileSync(this.dbPath, "utf-8"));
      } catch (err) {
        console.error("Failed to read DB for Evidence saving", err);
      }
    }

    if (!dbContent.evidenceList) {
      dbContent.evidenceList = [];
    }

    // De-duplicate: replace if exists, or append
    const existingIndex = dbContent.evidenceList.findIndex((item: any) => item.id === evidence.id || item.content === evidence.content);
    
    // Add freshness metadata as requested by Part 14
    const freshEvidence = {
      ...evidence,
      lastVerified: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(), // Expires in 7 days
      nextRefresh: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(), // Refresh in 2 days
    };

    if (existingIndex >= 0) {
      dbContent.evidenceList[existingIndex] = freshEvidence;
    } else {
      dbContent.evidenceList.unshift(freshEvidence);
    }

    // Keep database size healthy
    if (dbContent.evidenceList.length > 500) {
      dbContent.evidenceList = dbContent.evidenceList.slice(0, 500);
    }

    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(dbContent, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write to DB during Evidence saving", err);
    }
  }

  public async getLatest(limit = 20): Promise<Evidence[]> {
    if (fs.existsSync(this.dbPath)) {
      try {
        const dbContent = JSON.parse(fs.readFileSync(this.dbPath, "utf-8"));
        return (dbContent.evidenceList || []).slice(0, limit);
      } catch (err) {
        console.error("Failed to read Evidence list", err);
      }
    }
    return [];
  }
}
