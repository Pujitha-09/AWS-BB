import { AWSService, ServiceKey } from '@/types';

export const AWS_PRICING: Record<ServiceKey, AWSService> = {
  ec2: {
    name: 'EC2 (Virtual Servers)',
    basePrice: 0.0116,
    unit: 'hours',
    description: 'Virtual compute instances'
  },
  s3: {
    name: 'S3 (Storage)',
    basePrice: 0.023,
    unit: 'GB',
    description: 'Object storage service'
  },
  lambda: {
    name: 'Lambda (Serverless)',
    basePrice: 0.0000002,
    unit: 'requests',
    description: 'Serverless compute',
    freeRequests: 1000000
  },
  dynamodb: {
    name: 'DynamoDB (NoSQL Database)',
    basePrice: 0.25,
    unit: 'GB',
    description: 'Managed NoSQL database'
  },
  rds: {
    name: 'RDS (Relational Database)',
    basePrice: 0.017,
    unit: 'hours',
    description: 'Managed relational database'
  }
};
