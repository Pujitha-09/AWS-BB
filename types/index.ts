// types/index.ts
export interface AWSService {
  name: string;
  basePrice: number;
  unit: string;
  description: string;
  freeRequests?: number;
}

export type ServiceKey = 'ec2' | 's3' | 'lambda' | 'dynamodb' | 'rds';

export interface SelectedServices {
  [key: string]: boolean;
}

export interface UsageData {
  [key: string]: number;
}

// Fixed: Use Record type instead of mapped type with properties
export type SavingsTips = Record<ServiceKey, string[]>;