import React from 'react';
import { Box, Text } from 'ink';
import { SPACING_ROW } from '../constants';
import { ProgramOptions } from '../types';
import { Style } from './Style';

export interface IndexHelpProps extends ProgramOptions {
	children?: React.ReactNode;
}

/**
 * A React component that renders a help menu for the entire program.
 */
export function IndexHelp(props: IndexHelpProps) {
	const { banner, bin, children, footer, header, name, version } = props;

	return (
		<Box flexDirection="column" marginBottom={1}>
			{!!banner && (
				<Box>
					<Text>{banner}</Text>
				</Box>
			)}

			<Box marginTop={SPACING_ROW}>
				<Text>
					{`${name} v${version}`} <Style type="muted">{bin}</Style>
				</Text>
			</Box>

			{!!header && (
				<Box marginTop={SPACING_ROW}>
					<Text>{header}</Text>
				</Box>
			)}

			{children}

			{!!footer && (
				<Box marginTop={SPACING_ROW}>
					<Text>{footer}</Text>
				</Box>
			)}
		</Box>
	);
}
