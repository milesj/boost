import type { ReactNode } from 'react';
import styles from './styles.module.css';

export interface BadgeGroupProps {
	children: ReactNode;
}

export default function BadgeGroup({ children }: BadgeGroupProps) {
	return <span className={styles.badgeGroup}>{children}</span>;
}
