import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function FinalApproverIcon({ size = 24, ...props }: IconProps) {
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
      <circle cx="12" cy="10" r="8" />
      <circle cx="12" cy="10" r="4" />
      <path d="M10 20h4" />
      <line x1="12" y1="18" x2="12" y2="22" />
      <path d="M8 22h8" />
    </svg>
  );
}
