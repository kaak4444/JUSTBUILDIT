/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";

export interface Snapshot {
  timestamp: string;
  entityId: string;
  value: number;
}

export class HistoricalDatabase {
  private dbPath = path.join(process.cwd(), "data", "db.json");

  public async saveSnapshot(entityId: string, value: number): Promise<void> {
    console.log(`[HistoricalDatabase] Saving historic snapshot: ${entityId} = ${value}`);
    let dbContent: any = { logs: [], snapshots: [] };
    
    if (fs.existsSync(this.dbPath)) {
      try {
        dbContent = JSON.parse(fs.readFileSync(this.dbPath, "utf-8"));
      } catch (err) {
        console.error("Failed to read DB for Snapshot saving", err);
      }
    }

    if (!dbContent.snapshots) {
      dbContent.snapshots = [];
    }

    dbContent.snapshots.push({
      timestamp: new Date().toISOString(),
      entityId,
      value
    });

    // Keep database snapshot size within limits
    if (dbContent.snapshots.length > 1000) {
      dbContent.snapshots = dbContent.snapshots.slice(dbContent.snapshots.length - 1000);
    }

    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(dbContent, null, 2), "utf-8");
    } catch (err) {
      console.error("Failed to write snapshots to DB", err);
    }
  }

  public async getHistory(entityId: string): Promise<Snapshot[]> {
    if (fs.existsSync(this.dbPath)) {
      try {
        const dbContent = JSON.parse(fs.readFileSync(this.dbPath, "utf-8"));
        return (dbContent.snapshots || []).filter((s: Snapshot) => s.entityId === entityId);
      } catch (err) {
        console.error("Failed to load snapshots history", err);
      }
    }
    return [];
  }
}
