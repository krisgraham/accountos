import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function SortIcon({ size = 24, ...props }: IconProps) {
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
      <polyline points="8 7 8 3 4 7" />
      <line x1="8" y1="3" x2="8" y2="15" />
      <polyline points="16 17 16 21 20 17" />
      <line x1="16" y1="21" x2="16" y2="9" />
    </svg>
  );
}
