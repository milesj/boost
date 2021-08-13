import React from 'react';
import { Box } from 'ink';
import { SPACING_ROW } from '../constants';
import { StyleType } from '../types';
import { Style } from './Style';

export interface HeaderProps {
	/** Text to display for the label. */
	label: string;
	/** The bottom margin. Defaults to `1`. */
	marginTop?: number;
	/** The top margin. Defaults to `1`. */
	marginBottom?: number;
	/** Customize the background color using Style. Defaults to normal text. */
	type?: StyleType | 'none';
}

/**
 * A React component that renders a header/title within a terminal menu.
 */
export function Header(props: HeaderProps) {
	const { label, marginTop = SPACING_ROW, marginBottom = SPACING_ROW, type = 'default' } = props;

	return (
		<Box marginBottom={marginBottom} marginTop={marginTop}>
			<Style bold inverted type={type}>
				{` ${label.toLocaleUpperCase()} `}
			</Style>
		</Box>
	);
}
