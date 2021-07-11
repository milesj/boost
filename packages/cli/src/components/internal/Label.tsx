import React from 'react';
import { Text } from 'ink';

export interface LabelProps {
	children: NonNullable<React.ReactNode>;
}

export function Label({ children }: LabelProps) {
	if (typeof children === 'string') {
		return <Text bold>{children}</Text>;
	}

	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <>{children}</>;
}
