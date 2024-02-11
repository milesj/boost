import { type ReactNode } from 'react';

export interface BadgeProps {
	children: ReactNode;
	type: string;
}

export default function Badge({ children, type }: BadgeProps) {
	return <span className={`badge badge--${type}`}>{children}</span>;
}
