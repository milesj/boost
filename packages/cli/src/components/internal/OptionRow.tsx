/* eslint-disable no-nested-ternary, @typescript-eslint/prefer-nullish-coalescing */

import type { ReactNode } from 'react';
import { Box } from 'ink';
import { Style } from '../Style';

export interface OptionRowProps {
	highlighted?: boolean;
	icon: NonNullable<ReactNode>;
	iconActive: NonNullable<ReactNode>;
	label: NonNullable<ReactNode>;
	selected?: boolean;
}

export function OptionRow({ highlighted, icon, iconActive, label, selected }: OptionRowProps) {
	return (
		<Box flexDirection="row">
			<Box flexGrow={0} marginRight={1}>
				<Style type={highlighted ? 'info' : selected ? 'notice' : 'muted'}>
					{highlighted || selected ? iconActive : icon}
				</Style>
			</Box>

			<Box>
				<Style type={highlighted ? 'info' : selected ? 'notice' : 'none'}>{label}</Style>
			</Box>
		</Box>
	);
}
