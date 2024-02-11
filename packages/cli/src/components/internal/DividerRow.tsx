import type { ReactNode } from 'react';
import { Box } from 'ink';
import { Style } from '../Style';

export interface DividerRowProps {
	label: NonNullable<ReactNode>;
}

export function DividerRow({ label }: DividerRowProps) {
	return (
		<Box marginLeft={2}>
			<Style type="muted">{label || '────'}</Style>
		</Box>
	);
}
