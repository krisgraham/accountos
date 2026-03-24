import { type SVGProps } from 'react';
import { TechApproverIcon } from './TechApproverIcon';
import { BusinessApproverIcon } from './BusinessApproverIcon';
import { BudgetAuthorityIcon } from './BudgetAuthorityIcon';
import { FinalApproverIcon } from './FinalApproverIcon';
import { BusinessDomainExpertIcon } from './BusinessDomainExpertIcon';
import { DataDomainExpertIcon } from './DataDomainExpertIcon';
import { TechDomainExpertIcon } from './TechDomainExpertIcon';
import { ProcessOwnerIcon } from './ProcessOwnerIcon';
import { DayToDayContactIcon } from './DayToDayContactIcon';
import { EngagementChampionIcon } from './EngagementChampionIcon';
import { EngagementBlockerIcon } from './EngagementBlockerIcon';

type EngagementRole =
  | 'TECH_APPROVER'
  | 'BUSINESS_APPROVER'
  | 'BUDGET_AUTHORITY'
  | 'FINAL_APPROVER'
  | 'BUSINESS_DOMAIN_EXPERT'
  | 'DATA_DOMAIN_EXPERT'
  | 'TECH_DOMAIN_EXPERT'
  | 'PROCESS_OWNER'
  | 'DAY_TO_DAY_CONTACT'
  | 'CHAMPION'
  | 'BLOCKER';

interface EngagementRoleBadgeProps {
  role: EngagementRole;
  className?: string;
}

type IconComponent = (props: SVGProps<SVGSVGElement> & { size?: number }) => JSX.Element;

const ENGAGEMENT_ROLE_CONFIG: Record<EngagementRole, { icon: IconComponent; label: string; bg: string; text: string }> = {
  TECH_APPROVER: {
    icon: TechApproverIcon,
    label: 'Tech Appr.',
    bg: 'bg-blue-900/30',
    text: 'text-blue-400',
  },
  BUSINESS_APPROVER: {
    icon: BusinessApproverIcon,
    label: 'Biz Appr.',
    bg: 'bg-purple-900/30',
    text: 'text-purple-400',
  },
  BUDGET_AUTHORITY: {
    icon: BudgetAuthorityIcon,
    label: 'Budget',
    bg: 'bg-amber-900/30',
    text: 'text-amber-400',
  },
  FINAL_APPROVER: {
    icon: FinalApproverIcon,
    label: 'Final Appr.',
    bg: 'bg-red-900/30',
    text: 'text-red-400',
  },
  BUSINESS_DOMAIN_EXPERT: {
    icon: BusinessDomainExpertIcon,
    label: 'Biz Expert',
    bg: 'bg-teal-900/30',
    text: 'text-teal-400',
  },
  DATA_DOMAIN_EXPERT: {
    icon: DataDomainExpertIcon,
    label: 'Data Expert',
    bg: 'bg-cyan-900/30',
    text: 'text-cyan-400',
  },
  TECH_DOMAIN_EXPERT: {
    icon: TechDomainExpertIcon,
    label: 'Tech Expert',
    bg: 'bg-blue-900/30',
    text: 'text-blue-300',
  },
  PROCESS_OWNER: {
    icon: ProcessOwnerIcon,
    label: 'Process',
    bg: 'bg-green-900/30',
    text: 'text-green-400',
  },
  DAY_TO_DAY_CONTACT: {
    icon: DayToDayContactIcon,
    label: 'Day-to-Day',
    bg: 'bg-slate-800/50',
    text: 'text-slate-400',
  },
  CHAMPION: {
    icon: EngagementChampionIcon,
    label: 'Champion',
    bg: 'bg-green-900/30',
    text: 'text-green-300',
  },
  BLOCKER: {
    icon: EngagementBlockerIcon,
    label: 'Blocker',
    bg: 'bg-red-900/30',
    text: 'text-red-400',
  },
};

export function EngagementRoleBadge({ role, className = '' }: EngagementRoleBadgeProps) {
  const config = ENGAGEMENT_ROLE_CONFIG[role];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      <Icon size={10} />
      {config.label}
    </span>
  );
}
