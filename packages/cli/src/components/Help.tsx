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

// function extractDefault<K extends string, P>(
// 	key: K,
// ): (result: Record<K, React.ComponentType<P>>) => { default: React.ComponentType<P> } {
// 	return ({ [key]: component }) => ({ default: component });
// }

// const Commands = React.lazy(() =>
// 	import('./internal/HelpCommands').then(extractDefault('HelpCommands')),
// );

// const Options = React.lazy(() =>
// 	import('./internal/HelpOptions').then(extractDefault('HelpOptions')),
// );

// const Params = React.lazy(() => import('./internal/HelpParams').then(extractDefault('HelpParams')));

// const Usage = React.lazy(() => import('./internal/HelpUsage').then(extractDefault('HelpUsage')));

export interface HelpProps {
	/** Mapping of categories to use for command and option grouping. */
	categories?: Categories;
	/** Configuration metadata about the current command. */
	config?: CommandConfig;
	/** Mapping of commands, typically sub-commands. */
	commands?: CommandConfigMap;
	/** Delimiter to prefix within examples. Defaults to "$ ". */
	delimiter?: string;
	/** A header to display at the top of the output. */
	header?: string;
	/** Mapping of command options. */
	options?: OptionConfigMap;
	/** List of command params. */
	params?: ParamConfigList;
}

/**
 * A React component that renders a help menu for a command.
 * Includes all sub-commands, options, params, and more.
 */
// eslint-disable-next-line complexity
export function Help(props: HelpProps) {
	const { categories, commands, delimiter, options, header, params, config } = props;
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
