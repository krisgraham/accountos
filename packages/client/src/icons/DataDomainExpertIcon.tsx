import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function DataDomainExpertIcon({ size = 24, ...props }: IconProps) {
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
      <ellipse cx="10" cy="5" rx="7" ry="3" />
      <path d="M3 5v6c0 1.66 3.13 3 7 3" />
      <path d="M3 11v6c0 1.66 3.13 3 7 3" />
      <path d="M17 5v3" />
      <circle cx="19" cy="15" r="4" />
      <line x1="22" y1="18" x2="23.5" y2="19.5" />
    </svg>
  );
}
