import { type SVGProps } from 'react';
import { ChampionIcon } from './ChampionIcon';
import { EconomicBuyerIcon } from './EconomicBuyerIcon';
import { DecisionMakerIcon } from './DecisionMakerIcon';
import { TechnicalEvaluatorIcon } from './TechnicalEvaluatorIcon';
import { InfluencerIcon } from './InfluencerIcon';
import { ExecutiveSponsorIcon } from './ExecutiveSponsorIcon';
import { CoachIcon } from './CoachIcon';
import { EndUserIcon } from './EndUserIcon';
import { BlockerIcon } from './BlockerIcon';
import { GatekeeperIcon } from './GatekeeperIcon';

type StakeholderRole =
  | 'CHAMPION'
  | 'ECONOMIC_BUYER'
  | 'DECISION_MAKER'
  | 'TECHNICAL_EVALUATOR'
  | 'INFLUENCER'
  | 'EXECUTIVE_SPONSOR'
  | 'COACH'
  | 'END_USER'
  | 'BLOCKER'
  | 'GATEKEEPER';

interface RoleBadgeProps {
  role: StakeholderRole;
  className?: string;
}

type IconComponent = (props: SVGProps<SVGSVGElement> & { size?: number }) => JSX.Element;

const ROLE_CONFIG: Record<StakeholderRole, { icon: IconComponent; label: string; bg: string; text: string }> = {
  CHAMPION: {
    icon: ChampionIcon,
    label: 'Champion',
    bg: 'bg-green-900/30',
    text: 'text-green-400',
  },
  ECONOMIC_BUYER: {
    icon: EconomicBuyerIcon,
    label: 'Economic Buyer',
    bg: 'bg-purple-900/30',
    text: 'text-purple-400',
  },
  DECISION_MAKER: {
    icon: DecisionMakerIcon,
    label: 'Decision Maker',
    bg: 'bg-purple-900/40',
    text: 'text-purple-300',
  },
  TECHNICAL_EVALUATOR: {
    icon: TechnicalEvaluatorIcon,
    label: 'Technical Evaluator',
    bg: 'bg-blue-900/30',
    text: 'text-blue-400',
  },
  INFLUENCER: {
    icon: InfluencerIcon,
    label: 'Influencer',
    bg: 'bg-teal-900/30',
    text: 'text-teal-400',
  },
  EXECUTIVE_SPONSOR: {
    icon: ExecutiveSponsorIcon,
    label: 'Executive Sponsor',
    bg: 'bg-amber-900/30',
    text: 'text-amber-400',
  },
  COACH: {
    icon: CoachIcon,
    label: 'Coach',
    bg: 'bg-amber-900/20',
    text: 'text-amber-300',
  },
  END_USER: {
    icon: EndUserIcon,
    label: 'End User',
    bg: 'bg-slate-800/50',
    text: 'text-slate-400',
  },
  BLOCKER: {
    icon: BlockerIcon,
    label: 'Blocker',
    bg: 'bg-red-900/30',
    text: 'text-red-400',
  },
  GATEKEEPER: {
    icon: GatekeeperIcon,
    label: 'Gatekeeper',
    bg: 'bg-slate-800/60',
    text: 'text-slate-500',
  },
};

export function RoleBadge({ role, className = '' }: RoleBadgeProps) {
  const config = ROLE_CONFIG[role];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${config.bg} ${config.text} ${className}`}
    >
      <Icon size={12} />
      {config.label}
    </span>
  );
}
