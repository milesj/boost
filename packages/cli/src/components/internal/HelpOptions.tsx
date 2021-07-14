import React, { useMemo, useRef } from 'react';
import { Box, Text } from 'ink';
import { OptionConfig, OptionConfigMap } from '@boost/args';
import { stripAnsi } from '@boost/terminal';
import { SPACING_COL, SPACING_COL_WIDE, SPACING_ROW } from '../../constants';
import { formatDescription, formatType, groupByCategory } from '../../helpers';
import { msg } from '../../translate';
import { Categories } from '../../types';
import { Header } from '../Header';
import { Style } from '../Style';

function gatherOptionTags(config: OptionConfig): string[] {
	const tags: string[] = [];

	if (config.count) {
		tags.push(msg('cli:tagCount'));
	}

	if (config.multiple) {
		tags.push(msg('cli:tagMultiple') + (config.arity ? `(${config.arity})` : ''));
	}

	return tags;
}

export interface HelpOptionsProps {
	categories?: Categories;
	options: OptionConfigMap;
}

export function HelpOptions({ categories, options }: HelpOptionsProps) {
	const longWidth = useRef(0);
	const shortWidth = useRef(0);

	const items = useMemo(
		() =>
			Object.entries(options).map(([name, option]) => {
				const shortLabel = option.short ? `-${option.short},` : '';
				let longLabel = `--${option.default === true ? 'no-' : ''}${name}`;

				if (option.type !== 'boolean') {
					longLabel += ' ';
					longLabel += formatType(option);
				}

				const longLabelStripped = stripAnsi(longLabel);
				const shortLabelStripped = stripAnsi(shortLabel);

				if (longLabelStripped.length > longWidth.current) {
					longWidth.current = longLabelStripped.length;
				}

				if (shortLabelStripped.length > shortWidth.current) {
					shortWidth.current = shortLabelStripped.length;
				}

				return {
					...option,
					longLabel,
					name,
					shortLabel,
				};
			}),
		[options],
	);

	const categorizedOptions = useMemo(
		() => groupByCategory(items, categories ?? {}),
		[categories, items],
	);
	const categoryCount = Object.keys(categorizedOptions).length;
	const showShortColumn = shortWidth.current > 0;

	return (
		<>
			<Header label={msg('cli:labelOptions')} />

			{Object.entries(categorizedOptions).map(([key, category], index) => (
				<Box key={key} flexDirection="column">
					{!!category.name && categoryCount > 1 && (
						<Box marginTop={index === 0 ? 0 : SPACING_ROW} paddingLeft={SPACING_COL}>
							<Style bold type="none">
								{category.name}
							</Style>
						</Box>
					)}

					{category.items.map((config) => (
						<Box key={key + config.name} flexDirection="row" paddingLeft={SPACING_COL}>
							{showShortColumn && (
								<Box flexGrow={0} width={shortWidth.current + SPACING_COL}>
									<Text>{config.shortLabel}</Text>
								</Box>
							)}

							<Box flexGrow={0} width={longWidth.current + SPACING_COL_WIDE}>
								<Text>{config.longLabel}</Text>
							</Box>

							<Box flexGrow={1}>
								<Text wrap="wrap">{formatDescription(config, gatherOptionTags(config))}</Text>
							</Box>
						</Box>
					))}
				</Box>
			))}
		</>
	);
}
