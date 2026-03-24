import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function BusinessDomainExpertIcon({ size = 24, ...props }: IconProps) {
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
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-3 13.33V18h6v-2.67A7 7 0 0 0 12 2z" />
      <rect x="16" y="12" width="5" height="7" rx="1" />
      <line x1="18" y1="15" x2="19.5" y2="15" />
    </svg>
  );
}
