import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  type: string;
}

export default function Badge({ children, type }: BadgeProps) {
  return <span className={`badge badge--${type}`}>{children}</span>;
}
