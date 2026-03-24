import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function ChampionIcon({ size = 24, ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M6 9V2h12v7" />
      <path d="M6 5H3v4a3 3 0 0 0 3 3" />
      <path d="M18 5h3v4a3 3 0 0 1-3 3" />
      <path d="M6 9a6 6 0 0 0 12 0" />
      <line x1="12" y1="15" x2="12" y2="19" />
      <path d="M8 19h8v2H8v-2z" />
    </svg>
  );
}
