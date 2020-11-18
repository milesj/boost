import { Text } from 'ink';
import React from 'react';

export interface LabelProps {
  children: string | React.ReactElement;
}

export function Label({ children }: LabelProps) {
  if (typeof children === 'string') {
    return <Text bold>{children}</Text>;
  }

  return children;
}
