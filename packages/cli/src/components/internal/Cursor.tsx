import React from 'react';
import { Text } from 'ink';
import { Style } from '../Style';

export interface CursorProps {
	focused?: boolean;
	hideCursor?: boolean;
	position: number;
	value: string;
}

export function Cursor({ focused, hideCursor, position, value }: CursorProps) {
	if (!focused) {
		return <Text>{value}</Text>;
	}

	return (
		<Text>
			{value.slice(0, position)}
			{hideCursor ? (
				value[position]
			) : (
				<Style inverted type="info">
					{value[position] || ' '}
				</Style>
			)}
			{value.slice(position + 1)}
		</Text>
	);
}
