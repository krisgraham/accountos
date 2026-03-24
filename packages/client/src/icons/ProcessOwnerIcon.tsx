import { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function ProcessOwnerIcon({ size = 24, ...props }: IconProps) {
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
      <circle cx="5" cy="6" r="3" />
      <path d="M8 6h5" />
      <path d="M13 6l-2 -2" />
      <path d="M13 6l-2 2" />
      <path d="M13 6v6" />
      <circle cx="19" cy="12" r="3" />
      <path d="M13 12h3" />
      <path d="M13 12v6" />
      <circle cx="5" cy="18" r="3" />
      <path d="M8 18h5" />
      <path d="M13 18l-2 -2" />
      <path d="M13 18l-2 2" />
    </svg>
  );
}
