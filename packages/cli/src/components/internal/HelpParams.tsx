import React, { useMemo } from 'react';
import { Box, Text } from 'ink';
import { ParamConfig, ParamConfigList } from '@boost/args';
import { SPACING_COL, SPACING_COL_WIDE } from '../../constants';
import { formatDescription, formatType, getLongestWidth } from '../../helpers';
import { msg } from '../../translate';
import { CommandConfig } from '../../types';
import { Header } from '../Header';

function gatherParamTags(config: ParamConfig): string[] {
	const tags: string[] = [];

	if (config.required) {
		tags.push(msg('cli:tagRequired'));
	}

	return tags;
}

export interface HelpParamsProps {
	config?: CommandConfig;
	params: ParamConfigList;
}

export function HelpParams({ config, params }: HelpParamsProps) {
	const labels = useMemo(
		() => params.map((p, index) => `${p.label ?? index} ${formatType(p)}`),
		[params],
	);
	const labelWidth = getLongestWidth(labels);
	const allowVariadic = config?.allowVariadicParams;

	return (
		<>
			<Header label={msg('cli:labelParams')} />

			{params.map((param, index) => {
				if (param.hidden) {
					return null;
				}

				const desc = param ? formatDescription(param, gatherParamTags(param)) : '';

				return (
					<Box key={`${labels[index]}-${index}`} flexDirection="row" paddingLeft={SPACING_COL}>
						<Box flexGrow={0} width={labelWidth + SPACING_COL_WIDE}>
							<Text>{labels[index]}</Text>
						</Box>

						<Box flexGrow={1}>
							<Text wrap="wrap">{desc}</Text>
						</Box>
					</Box>
				);
			})}

			{allowVariadic && (
				<Box paddingLeft={SPACING_COL}>
					<Text>
						{`…${typeof allowVariadic === 'string' ? allowVariadic : ''}`}{' '}
						{formatType({
							multiple: true,
							type: 'string',
						})}
					</Text>
				</Box>
			)}
		</>
	);
}
