import React from 'react';
import { Box, Text } from 'ink';
import { toArray } from '@boost/common';
import { DELIMITER, SPACING_COL } from '../../constants';
import { msg } from '../../translate';
import { Header } from '../Header';

export interface HelpUsageProps {
	delimiter?: string;
	usage?: string[] | string;
}

export function HelpUsage({ delimiter = DELIMITER, usage = '' }: HelpUsageProps) {
	return (
		<>
			<Header label={msg('cli:labelUsage')} />

			{toArray(usage).map((example) => (
				<Box key={example} paddingLeft={SPACING_COL}>
					<Text>{example.startsWith(delimiter) ? example : delimiter + example}</Text>
				</Box>
			))}
		</>
	);
}
