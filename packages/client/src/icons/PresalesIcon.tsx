import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function PresalesIcon({ size = 24, ...props }: IconProps) {
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
      <path d="M12 2C9.24 2 7 4.24 7 7v2c0 .83.67 1.5 1.5 1.5h7c.83 0 1.5-.67 1.5-1.5V7c0-2.76-2.24-5-5-5z" />
      <path d="M7 21l2-4h6l2 4" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}
