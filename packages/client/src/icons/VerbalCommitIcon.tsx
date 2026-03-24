import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function VerbalCommitIcon({ size = 24, ...props }: IconProps) {
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
      <path d="M20 17a2 2 0 0 0-1.85-1.27l-3.15.64-2-2.36" />
      <path d="M4 17a2 2 0 0 1 1.85-1.27l3.15.64 2-2.36" />
      <path d="M7 21l2-4h6l2 4" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
