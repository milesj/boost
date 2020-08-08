import React from 'react';
import styles from './styles.module.css';

export interface BadgeGroupProps {
  children: React.ReactNode;
}

export default function BadgeGroup({ children }: BadgeGroupProps) {
  return <span className={styles.badgeGroup}>{children}</span>;
}
