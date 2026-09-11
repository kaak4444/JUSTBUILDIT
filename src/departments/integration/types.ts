/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Health {
  healthy: boolean;
  status: "Healthy" | "Expired Token" | "API Changed" | "Quota Low" | "Rate Limited" | "Disconnected";
  latencyMs: number;
  lastChecked: string;
  errorMessage?: string;
}

export interface Result {
  success: boolean;
  id?: string;
  url?: string;
  message?: string;
  timestamp: string;
}

export interface Connector {
  id: string;
  provider: string;
  authenticate(): Promise<void>;
  publish(payload: any): Promise<Result>;
  update(id: string, payload: any): Promise<Result>;
  delete(id: string): Promise<Result>;
  upload(file: any): Promise<string>;
  webhook(event: any): Promise<void>;
  health(): Promise<Health>;
}

export interface Credential {
  id: string;
  provider: string;
  token: string;
  refreshToken?: string;
  expiry?: string;
  scopes: string[];
}

export interface Job {
  id: string;
  provider: string;
  action: "publish" | "update" | "delete" | "upload" | "sync";
  payload: any;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  retries: number;
  maxRetries: number;
  errorMessage?: string;
  timestamp: string;
}
