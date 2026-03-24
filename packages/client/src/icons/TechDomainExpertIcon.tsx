import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function TechDomainExpertIcon({ size = 24, ...props }: IconProps) {
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
      <rect x="2" y="2" width="16" height="6" rx="1" />
      <rect x="2" y="10" width="16" height="6" rx="1" />
      <circle cx="6" cy="5" r="1" />
      <circle cx="6" cy="13" r="1" />
      <path d="M19 16l-1.5 1.5" />
      <circle cx="21" cy="19" r="3" />
    </svg>
  );
}
