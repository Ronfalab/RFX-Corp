export interface BusinessMetric {
  name: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down' | 'neutral';
}

export interface Project {
  id: number;
  name: string;
  status: 'In Corso' | 'Completato' | 'In Revisione' | 'Pianificato';
  budget: number;
  progress: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  TRACKER = 'TRACKER',
  STRATEGY = 'STRATEGY',
  ASSISTANT = 'ASSISTANT',
  SETTINGS = 'SETTINGS',
}

export interface AnalysisResult {
  title: string;
  content: string;
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'neutral';
}

export type EntityType = 'company' | 'erp' | 'product' | 'partner';
export type EntityStatus = 'Idea' | 'Pianificazione' | 'Sviluppo' | 'Attivo' | 'Exit';

// Base entity for simple tracking
export interface TrackedEntity {
  id: string;
  type: EntityType;
  name: string;
  status: EntityStatus;
  description: string;
  progress: number; // 0-100
  startDate: string;
}

// Detailed structure for Company Builder
export interface CompanyStep {
  id: string;
  label: string;
  isCompleted: boolean;
}

export interface CompanyCategory {
  id: string;
  name: string;
  progress: number;
  steps: CompanyStep[];
}

export interface DetailedCompany {
  id: string;
  name: string;
  logo?: string; // URL of the logo
  parentId?: string; // ID of the parent company (if any)
  ownership?: number; // Percentage owned by parent
  status: EntityStatus;
  categories: CompanyCategory[];
}

// Global Settings / Template Types
export interface TemplateCategory {
  id: string;
  name: string;
  steps: string[]; // Just labels for the template
}