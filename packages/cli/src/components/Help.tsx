/* eslint-disable promise/prefer-await-to-then */

import React, { Suspense } from 'react';
import { Box, Text } from 'ink';
import { OptionConfigMap, ParamConfigList } from '@boost/args';
import { SPACING_COL } from '../constants';
import { formatDescription } from '../helpers';
import { Categories, CommandConfig, CommandConfigMap } from '../types';
import { Header } from './Header';

function extractDefault<K extends string, P>(
	key: K,
): (result: Record<K, React.ComponentType<P>>) => { default: React.ComponentType<P> } {
	return ({ [key]: component }) => ({ default: component });
}

const Commands = React.lazy(() =>
	import('./internal/HelpCommands').then(extractDefault('HelpCommands')),
);

const Options = React.lazy(() =>
	import('./internal/HelpOptions').then(extractDefault('HelpOptions')),
);

const Params = React.lazy(() => import('./internal/HelpParams').then(extractDefault('HelpParams')));

const Usage = React.lazy(() => import('./internal/HelpUsage').then(extractDefault('HelpUsage')));

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

			<Suspense fallback={null}>
				{hasUsage && <Usage delimiter={delimiter} usage={config?.usage} />}

				{hasParams && <Params config={config} params={params!} />}

				{hasCommands && <Commands categories={categories} commands={commands!} />}

				{hasOptions && <Options categories={categories} options={options!} />}
			</Suspense>
		</Box>
	);
}
