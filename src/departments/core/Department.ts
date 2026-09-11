/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Worker {
  id: string;
  name: string;
  role: string;
  status: "IDLE" | "RUNNING" | "WAITING" | "COMPLETED" | "FAILED";
  progress: number;
  currentTask: string;
  avatar?: string;
  performanceScore: number;
  tasksCompleted: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "RUNNING" | "WAITING" | "REVIEW" | "COMPLETED" | "FAILED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  progress: number;
  createdAt: string;
  updatedAt: string;
  assignedWorkers: string[];
  output?: string;
}

export interface MemoryFact {
  id: string;
  category: string;
  content: string;
  confidence: number; // 0-100
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentMemory {
  facts: MemoryFact[];
  notes: string;
  knowledgeGraphNodesCount: number;
}

export interface DashboardKPIs {
  health: number; // percentage
  performance: number; // percentage
  speed: number; // score/minutes
  queueSize: number;
  memoryUsage: string;
  averageCompletionTime: string;
  workerCount: number;
}

export interface DepartmentSettings {
  concurrencyLimit: number;
  activeModel: string;
  strictQualityMode: boolean;
  autoHealEnabled: boolean;
}

export interface DepartmentLog {
  id: string;
  timestamp: string;
  level: "INFO" | "WARN" | "ERROR" | "DEBUG";
  workerId?: string;
  message: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  departmentId: string;
  type: "MISSION_CREATED" | "MISSION_STARTED" | "WORKER_ASSIGNED" | "WORKER_PROGRESS" | "MEMORY_UPDATED" | "REVIEW_TRIGGERED" | "MISSION_COMPLETED" | "MISSION_FAILED";
  message: string;
  icon?: string;
}

export interface Department {
  id: string;
  name: string;
  icon: string; // Lucide icon identifier
  description: string;
  workers: Worker[];
  missions: Mission[];
  memory: DepartmentMemory;
  kpis: DashboardKPIs;
  settings: DepartmentSettings;
  logs: DepartmentLog[];
}
