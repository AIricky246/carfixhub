export interface User {
  id: string;
  name: string;
  avatar: string;
  isPro: boolean;
}

export interface CarDetails {
  make: string;
  model: string;
  year: string;
  mileage: string;
  climate?: string;
  drivingStyle?: string;
}

export interface Issue {
  id: string;
  userId: string;
  user: User;
  car: CarDetails;
  title: string;
  description: string;
  imageUrl?: string;
  audioUrl?: string;
  status: 'Open' | 'Solved' | 'Analyzing';
  severity: 'Low' | 'Medium' | 'High';
  aiDiagnosis?: string;
  confidenceScore?: number;
  identifiedParts?: Array<{ name: string; description: string }>;
  maintenanceInsights?: Array<{ partName: string; estimatedRUL: string; replacementCost: string }>;
  createdAt: string;
  likes: number;
  comments: number;
}

export enum Page {
  DASHBOARD = 'DASHBOARD',
  NEW_ISSUE = 'NEW_ISSUE',
  COMMUNITY = 'COMMUNITY',
  SETTINGS = 'SETTINGS'
}

export interface ChartData {
  name: string;
  value: number;
}