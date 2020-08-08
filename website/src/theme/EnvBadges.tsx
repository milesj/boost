import React from 'react';
import Badge from './Badge';
import BadgeGroup from './BadgeGroup';

export interface EnvBadgesProps {
  backend?: boolean;
  frontend?: boolean;
  tooling?: boolean;
}

export default function EnvBadges({ backend, frontend, tooling }: EnvBadgesProps) {
  return (
    <BadgeGroup>
      {backend && <Badge type="warning">Backend</Badge>}

      {frontend && <Badge type="success">Frontend</Badge>}

      {tooling && <Badge type="primary">Tooling</Badge>}
    </BadgeGroup>
  );
}
