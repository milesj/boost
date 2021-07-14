import React, { useMemo, useRef } from 'react';
import { Box, Text } from 'ink';
import { stripAnsi } from '@boost/terminal';
import { SPACING_COL, SPACING_COL_WIDE, SPACING_ROW } from '../../constants';
import { formatCommandCall, formatDescription, groupByCategory } from '../../helpers';
import { msg } from '../../translate';
import { Categories, CommandConfigMap } from '../../types';
import { Header } from '../Header';
import { Style } from '../Style';

export interface HelpCommandsProps {
	categories?: Categories;
	commands: CommandConfigMap;
}

export function HelpCommands({ categories, commands }: HelpCommandsProps) {
	const pathWidth = useRef(0);

	const items = useMemo(
		() =>
			Object.entries(commands).map(([path, command]) => {
				const pathCall = formatCommandCall(path, command);
				const pathCallStripped = stripAnsi(pathCall);

				if (pathCallStripped.length > pathWidth.current) {
					pathWidth.current = pathCallStripped.length;
				}

				return {
					...command,
					name: path,
					path,
					pathCall,
				};
			}),
		[commands],
	);

	const categorizedCommands = useMemo(
		() => groupByCategory(items, categories ?? {}),
		[categories, items],
	);

	const categoryCount = Object.keys(categorizedCommands).length;

	return (
		<>
			<Header label={msg('cli:labelCommands')} />

			{Object.entries(categorizedCommands).map(([key, category], index) => (
				<Box key={key} flexDirection="column">
					{!!category.name && categoryCount > 1 && (
						<Box marginTop={index === 0 ? 0 : SPACING_ROW} paddingLeft={SPACING_COL}>
							<Style bold type="none">
								{category.name}
							</Style>
						</Box>
					)}

					{category.items.map((config) => {
						const desc = formatDescription(config);

						return (
							<Box key={key + config.path} flexDirection="row" paddingLeft={SPACING_COL}>
								<Box flexGrow={0} width={pathWidth.current + SPACING_COL_WIDE}>
									<Text>{config.pathCall}</Text>
								</Box>

								<Box flexGrow={1}>
									<Text wrap="wrap">{desc}</Text>
								</Box>
							</Box>
						);
					})}
				</Box>
			))}
		</>
	);
}
