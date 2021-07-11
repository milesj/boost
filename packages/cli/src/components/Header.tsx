import React from 'react';
import { Box } from 'ink';
import { SPACING_ROW } from '../constants';
import { StyleType } from '../types';
import { Style } from './Style';

export interface HeaderProps {
	label: string;
	marginTop?: number;
	marginBottom?: number;
	type?: StyleType | 'none';
}

export function Header({
	label,
	marginTop = SPACING_ROW,
	marginBottom = SPACING_ROW,
	type = 'default',
}: HeaderProps) {
	return (
		<Box marginBottom={marginBottom} marginTop={marginTop}>
			<Style bold inverted type={type}>
				{` ${label.toLocaleUpperCase()} `}
			</Style>
		</Box>
	);
}
