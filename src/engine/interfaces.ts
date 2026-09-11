/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// ============================================================================
// 1. Core Enumerations & Basic Types
// ============================================================================

export enum ProjectStatus {
  CREATED = "CREATED",
  PLANNING = "PLANNING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum TaskStatus {
  PENDING = "PENDING",
  WAITING = "WAITING",
  RUNNING = "RUNNING",
  REVIEW = "REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  RETRY = "RETRY",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  FAILED = "FAILED",
}

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
}

export interface ILogEntry {
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  metadata?: any;
}

// ============================================================================
// 2. The 12 Primary Architectural Objects
// ============================================================================

/**
 * 1. Project
 * Captures user intent, overall settings, status, and the list of related tasks.
 */
export interface IProject {
  id: string;
  title: string;
  description: string;
  goal: string;
  status: ProjectStatus;
  settings: Record<string, any>;
  tasks: ITask[];
  createdAt: string;
  updatedAt: string;
}

/**
 * 2. Task
 * A single atomic objective to be completed by a single Worker.
 */
export interface ITask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  workerType: string;
  dependencies: string[]; // Task IDs that must finish first
  status: TaskStatus;
  input: Record<string, any>;
  output?: Record<string, any>;
  assignedWorkerId?: string;
  error?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 3. Worker
 * An autonomous unit performing exactly one responsibility.
 */
export interface IWorker {
  id: string;
  name: string;
  description: string;
  departmentId: string;
  requiredSkills: string[];
  requiredCapabilities: string[];
  inputSchema: Record<string, any>;
  outputSchema: Record<string, any>;
  execute(task: ITask, context: IExecutionContext): Promise<ITaskResult>;
}

export interface ITaskResult {
  success: boolean;
  output?: Record<string, any>;
  error?: string;
  artifacts?: IAsset[];
}

/**
 * 4. Department
 * Organizational plugin grouping related Workers.
 */
export interface IDepartment {
  id: string;
  name: string;
  description: string;
  workerTypes: string[];
}

export abstract class Department implements IDepartment {
  abstract id: string;
  abstract name: string;
  abstract description: string;
  abstract workerTypes: string[];
  abstract workers: any[];
}

/**
 * 5. Provider
 * Abstract adapter for external capability fulfillment (LLMs, generators, databases).
 */
export interface IProvider {
  id: string;
  name: string;
  type: "LLM" | "IMAGE_GEN" | "CODE_GEN" | "SEARCH" | "DATABASE" | "STORAGE";
  capabilities: string[];
  request(capability: string, payload: any): Promise<any>;
}

/**
 * 6. Skill
 * Modular domain-knowledge package that guides worker output.
 */
export interface ISkill {
  id: string;
  name: string;
  description: string;
  rules: string[];
  bestPractices: string[];
  examples: Array<{ input: any; output: any }>;
}

/**
 * 7. Memory
 * Hierarchical data persistence service representing organizational brain.
 */
export interface IMemory {
  storeShortTerm(key: string, value: any): Promise<void>;
  retrieveShortTerm(key: string): Promise<any>;
  
  storeProjectMemory(projectId: string, key: string, value: any): Promise<void>;
  retrieveProjectMemory(projectId: string, key: string): Promise<any>;
  
  storeLongTerm(key: string, value: any): Promise<void>;
  retrieveLongTerm(key: string): Promise<any>;
  
  // Knowledge Graph
  addKnowledgeNode(id: string, label: string, properties: Record<string, any>): Promise<void>;
  addKnowledgeRelationship(sourceId: string, targetId: string, relType: string): Promise<void>;
  queryKnowledge(query: string): Promise<any>;
}

/**
 * 8. Event
 * Payload for the decouple event-driven message bus.
 */
export interface IEvent<T = any> {
  id: string;
  type: string;
  timestamp: string;
  source: string;
  payload: T;
}

/**
 * 9. Plugin
 * Modular installer adding departments, workers, skills, or providers.
 */
export interface IPlugin {
  id: string;
  name: string;
  version: string;
  description: string;
  initialize(container: IDIContainer): Promise<void>;
}

/**
 * 10. Integration
 * Real isolated interfaces connecting to external environments.
 */
export interface IIntegration {
  id: string;
  name: string;
  status: "CONNECTED" | "DISCONNECTED" | "UNCONFIGURED";
  testConnection(): Promise<boolean>;
  executeAction(actionName: string, params: any): Promise<any>;
}

/**
 * 11. Review
 * Captures detailed evaluations from Quality/Review Workers.
 */
export interface IReview {
  id: string;
  taskId: string;
  reviewerWorkerId: string;
  score: number; // 0 to 100
  approved: boolean;
  criticism: string[];
  suggestions: string[];
  createdAt: string;
}

/**
 * 12. Asset
 * Reusable product outputs generated by tasks (code files, images, PDFs, etc.).
 */
export interface IAsset {
  id: string;
  projectId: string;
  taskId: string;
  name: string;
  type: "CODE" | "IMAGE" | "PDF" | "TEMPLATE" | "DATA";
  url?: string;
  content: string; // File contents, image URLs, or serialized structured objects
  createdAt: string;
}

// ============================================================================
// 3. Infrastructure & Services
// ============================================================================

export interface IExecutionContext {
  projectId: string;
  providers: IProviderRegistry;
  skills: ISkillRegistry;
  memory: IMemory;
  logger: ILogger;
  eventBus: IEventBus;
  getProviderForCapability(capability: string): Promise<IProvider>;
  loadSkills(skillIds: string[]): Promise<ISkill[]>;
}

export interface ILogger {
  debug(source: string, message: string, metadata?: any): void;
  info(source: string, message: string, metadata?: any): void;
  warn(source: string, message: string, metadata?: any): void;
  error(source: string, message: string, metadata?: any): void;
  getLogs(): ILogEntry[];
  subscribe(callback: (entry: ILogEntry) => void): () => void;
}

export interface IConfigManager {
  get(key: string, defaultValue?: any): any;
  set(key: string, value: any): void;
  getAll(): Record<string, any>;
  subscribe(callback: (config: Record<string, any>) => void): () => void;
}

export interface IEventBus {
  publish(event: Omit<IEvent, "id" | "timestamp">): void;
  subscribe(eventType: string, handler: (event: IEvent) => void): () => void;
  subscribeAll(handler: (event: IEvent) => void): () => void;
}

export interface IDIContainer {
  register<T>(name: string, instance: T): void;
  resolve<T>(name: string): T;
  has(name: string): boolean;
}

// Registries representing specific systems
export interface IWorkerRegistry {
  register(worker: IWorker): void;
  get(workerType: string): IWorker | undefined;
  list(): IWorker[];
}

export interface IDepartmentRegistry {
  register(dept: IDepartment): void;
  get(id: string): IDepartment | undefined;
  list(): IDepartment[];
}

export interface IProviderRegistry {
  register(provider: IProvider): void;
  get(id: string): IProvider | undefined;
  list(): IProvider[];
  findBestForCapability(capability: string): IProvider | undefined;
}

export interface ISkillRegistry {
  register(skill: ISkill): void;
  get(id: string): ISkill | undefined;
  list(): ISkill[];
}

export interface IProjectManager {
  createProject(title: string, description: string, settings: Record<string, any>): Promise<IProject>;
  getProject(id: string): Promise<IProject | undefined>;
  listProjects(): Promise<IProject[]>;
}

export interface IOrchestrator {
  submitProject(project: IProject): Promise<void>;
  cancelProject(projectId: string): Promise<void>;
  getProjectProgress(projectId: string): number;
}
