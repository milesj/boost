import React from 'react';
import { Box, Text } from 'ink';
import { OptionConfigMap, ParamConfigList } from '@boost/args';
import { SPACING_COL } from '../constants';
import { formatDescription } from '../helpers';
import { Categories, CommandConfig, CommandConfigMap } from '../types';
import { Header } from './Header';
import { HelpCommands } from './internal/HelpCommands';
import { HelpOptions } from './internal/HelpOptions';
import { HelpParams } from './internal/HelpParams';
import { HelpUsage } from './internal/HelpUsage';

export interface HelpProps {
	categories?: Categories;
	config?: CommandConfig;
	commands?: CommandConfigMap;
	delimiter?: string;
	header?: string;
	options?: OptionConfigMap;
	params?: ParamConfigList;
}

// eslint-disable-next-line complexity
export function Help({
	categories,
	commands,
	delimiter,
	options,
	header,
	params,
	config,
}: HelpProps) {
	const hasDesc = Boolean(config?.description);
	const hasUsage = Boolean(config?.usage && config.usage.length > 0);
	const hasParams = Boolean(params && params.length > 0);
	const hasCommands = Boolean(commands && Object.keys(commands).length > 0);
	const hasOptions = Boolean(options && Object.keys(options).length > 0);

	return (
		<Box flexDirection="column">
			{(hasDesc || hasUsage) && header && <Header label={header} />}

			{hasDesc && (
				<Box paddingLeft={SPACING_COL}>
					<Text>{formatDescription(config!)}</Text>
				</Box>
			)}

			{hasUsage && <HelpUsage delimiter={delimiter} usage={config?.usage} />}

			{hasParams && <HelpParams config={config} params={params!} />}

			{hasCommands && <HelpCommands categories={categories} commands={commands!} />}

			{hasOptions && <HelpOptions categories={categories} options={options!} />}
		</Box>
	);
}
