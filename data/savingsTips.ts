// data/savingsTips.ts
import { SavingsTips } from '@/types';

export const SAVINGS_TIPS: SavingsTips = {
  ec2: [
    "💡 Use Reserved Instances for 24/7 workloads (up to 75% savings)",
    "💡 Consider Spot Instances for flexible workloads (up to 90% savings)",
    "💡 Right-size your instances - monitor CPU usage"
  ],
  s3: [
    "💡 Use S3 Intelligent Tiering for automatic cost optimization",
    "💡 Move old data to S3 Glacier for long-term storage (80% cheaper)",
    "💡 Enable S3 lifecycle policies to automatically transition data"
  ],
  lambda: [
    "💡 Optimize memory allocation - you pay for what you configure",
    "💡 Use ARM-based Graviton2 processors for 20% better price performance",
    "💡 First 1M requests per month are free!"
  ],
  dynamodb: [
    "💡 Use DynamoDB On-Demand for unpredictable workloads",
    "💡 Consider provisioned capacity for steady workloads",
    "💡 Enable auto-scaling to optimize costs"
  ],
  rds: [
    "💡 Use Multi-AZ only for production environments",
    "💡 Consider Aurora Serverless for variable workloads",
    "💡 Use read replicas instead of larger instances when possible"
  ]
};