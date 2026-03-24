import { z } from 'zod';

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const StakeholderRole = z.enum([
  'CHAMPION',
  'ECONOMIC_BUYER',
  'DECISION_MAKER',
  'TECHNICAL_EVALUATOR',
  'INFLUENCER',
  'EXECUTIVE_SPONSOR',
  'COACH',
  'END_USER',
  'BLOCKER',
  'GATEKEEPER',
]);

export type StakeholderRole = z.infer<typeof StakeholderRole>;

export const Sentiment = z.enum([
  'ADVOCATE',
  'SUPPORTIVE',
  'NEUTRAL',
  'RESISTANT',
  'BLOCKER',
]);

export type Sentiment = z.infer<typeof Sentiment>;

export const InfluenceLevel = z.enum(['HIGH', 'MEDIUM', 'LOW']);
export type InfluenceLevel = z.infer<typeof InfluenceLevel>;

export const HealthStatus = z.enum(['HEALTHY', 'MONITOR', 'AT_RISK']);
export type HealthStatus = z.infer<typeof HealthStatus>;

export const ProjectType = z.enum(['PRESALES', 'ACTIVE', 'ONGOING', 'STRATEGIC']);
export type ProjectType = z.infer<typeof ProjectType>;

export const ContractStatus = z.enum([
  'PROPOSED',
  'VERBAL_COMMIT',
  'CONTRACTED',
  'INVOICING',
]);

export type ContractStatus = z.infer<typeof ContractStatus>;

export const CommunicationType = z.enum([
  'IN_PERSON',
  'VIDEO_CALL',
  'PHONE_CALL',
  'EMAIL',
  'COFFEE_MEAL',
  'MESSAGE',
  'CONFERENCE',
]);

export type CommunicationType = z.infer<typeof CommunicationType>;

export const ActionItemStatus = z.enum(['OPEN', 'IN_PROGRESS', 'DONE']);
export type ActionItemStatus = z.infer<typeof ActionItemStatus>;

export const EngagementStatus = z.enum([
  'NOT_YET_ENGAGED',
  'OUTREACH_INITIATED',
  'INITIAL_CONTACT',
  'RELATIONSHIP_BUILDING',
  'ACTIVE_RELATIONSHIP',
  'DORMANT',
  'RE_ENGAGING',
]);

export type EngagementStatus = z.infer<typeof EngagementStatus>;

export const RelationshipIntelCategory = z.enum([
  'PERCEPTION',
  'HISTORY',
  'RISK_SIGNAL',
  'COMPETITIVE_INTEL',
]);

export type RelationshipIntelCategory = z.infer<typeof RelationshipIntelCategory>;

export const EngagementRole = z.enum([
  'TECH_APPROVER',
  'BUSINESS_APPROVER',
  'BUDGET_AUTHORITY',
  'FINAL_APPROVER',
  'BUSINESS_DOMAIN_EXPERT',
  'DATA_DOMAIN_EXPERT',
  'TECH_DOMAIN_EXPERT',
  'PROCESS_OWNER',
  'DAY_TO_DAY_CONTACT',
  'CHAMPION',
  'BLOCKER',
]);

export type EngagementRole = z.infer<typeof EngagementRole>;

export const EngagementStrategyStatus = z.enum(['ACTIVE', 'COMPLETED', 'SUPERSEDED']);
export type EngagementStrategyStatus = z.infer<typeof EngagementStrategyStatus>;

export const DesireCategory = z.enum([
  'TECHNICAL',
  'STRATEGIC',
  'CAREER',
  'PERSONAL',
]);

export type DesireCategory = z.infer<typeof DesireCategory>;
