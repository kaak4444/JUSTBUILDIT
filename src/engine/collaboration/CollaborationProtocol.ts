/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface IWorkerRequest {
  id: string;
  senderId: string;
  targetId: string;
  query: string;
  payload: any;
  timestamp: string;
  timeoutMs?: number;
}

export interface IWorkerResponse {
  requestId: string;
  senderId: string; // The one who responded
  targetId: string; // The original requester
  status: "SUCCESS" | "FAILED" | "TIMEOUT" | "CANCELLED";
  payload?: any;
  error?: string;
  timestamp: string;
}

export interface IWorkerConversation {
  id: string;
  participants: string[];
  messages: Array<IWorkerRequest | IWorkerResponse>;
  createdAt: string;
}

export class WorkerMailbox {
  private static mailboxes = new Map<string, WorkerMailbox>();
  private pendingRequests = new Map<string, (response: IWorkerResponse) => void>();
  private messageQueue: Array<IWorkerRequest | IWorkerResponse> = [];
  private listeners: Array<(msg: IWorkerRequest) => void> = [];

  constructor(public workerId: string) {}

  static getMailbox(workerId: string): WorkerMailbox {
    let box = this.mailboxes.get(workerId);
    if (!box) {
      box = new WorkerMailbox(workerId);
      this.mailboxes.set(workerId, box);
    }
    return box;
  }

  // Push message to queue
  receiveMessage(msg: IWorkerRequest | IWorkerResponse) {
    this.messageQueue.push(msg);
    if ("query" in msg) {
      // It's a request
      this.listeners.forEach(listener => listener(msg));
    } else {
      // It's a response
      const resolver = this.pendingRequests.get(msg.requestId);
      if (resolver) {
        resolver(msg);
        this.pendingRequests.delete(msg.requestId);
      }
    }
  }

  // Register listener for requests
  onReceiveRequest(callback: (req: IWorkerRequest) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  // ask() - send request and wait for reply
  async ask(targetId: string, query: string, payload: any = {}, timeoutMs = 15000): Promise<IWorkerResponse> {
    const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const request: IWorkerRequest = {
      id: requestId,
      senderId: this.workerId,
      targetId,
      query,
      payload,
      timestamp: new Date().toISOString(),
      timeoutMs
    };

    const targetMailbox = WorkerMailbox.getMailbox(targetId);

    return new Promise<IWorkerResponse>((resolve) => {
      let timeoutId: NodeJS.Timeout | null = null;

      const handleResponse = (res: IWorkerResponse) => {
        if (timeoutId) clearTimeout(timeoutId);
        resolve(res);
      };

      this.pendingRequests.set(requestId, handleResponse);

      // Dispatch request to target
      targetMailbox.receiveMessage(request);

      // Set timeout
      if (timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          if (this.pendingRequests.has(requestId)) {
            this.pendingRequests.delete(requestId);
            resolve({
              requestId,
              senderId: targetId,
              targetId: this.workerId,
              status: "TIMEOUT",
              error: `Request timed out after ${timeoutMs}ms.`,
              timestamp: new Date().toISOString()
            });
          }
        }, timeoutMs);
      }
    });
  }

  // reply() - respond to a request
  reply(request: IWorkerRequest, payload: any = {}, status: "SUCCESS" | "FAILED" = "SUCCESS", error?: string) {
    const response: IWorkerResponse = {
      requestId: request.id,
      senderId: this.workerId,
      targetId: request.senderId,
      status,
      payload,
      error,
      timestamp: new Date().toISOString()
    };

    const targetMailbox = WorkerMailbox.getMailbox(request.senderId);
    targetMailbox.receiveMessage(response);
  }

  // broadcast() - send request to multiple mailboxes
  broadcast(targetIds: string[], query: string, payload: any = {}): Promise<IWorkerResponse[]> {
    const promises = targetIds.map(targetId => this.ask(targetId, query, payload, 8000));
    return Promise.all(promises);
  }
}
