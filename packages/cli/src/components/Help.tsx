/* eslint-disable react/destructuring-assignment */

import React from 'react';
import { Box, Text } from 'ink';
import { OptionConfig, OptionConfigMap, ParamConfig, ParamConfigList } from '@boost/args';
import { toArray } from '@boost/common';
import { stripAnsi } from '@boost/terminal';
import { DELIMITER, SPACING_COL, SPACING_COL_WIDE, SPACING_ROW } from '../constants';
import {
	formatCommandCall,
	formatDescription,
	formatType,
	getLongestWidth,
	groupByCategory,
} from '../helpers';
import { msg } from '../translate';
import { Categories, CommandConfig, CommandConfigMap } from '../types';
import { Header } from './Header';
import { Style } from './Style';

export interface HelpProps {
	categories?: Categories;
	config?: CommandConfig;
	commands?: CommandConfigMap;
	delimiter?: string;
	header?: string;
	options?: OptionConfigMap;
	params?: ParamConfigList;
}

export class Help extends React.Component<HelpProps> {
	gatherOptionTags(config: OptionConfig): string[] {
		const tags: string[] = [];

		if (config.count) {
			tags.push(msg('cli:tagCount'));
		}

		if (config.multiple) {
			tags.push(msg('cli:tagMultiple') + (config.arity ? `(${config.arity})` : ''));
		}

		return tags;
	}

	gatherParamTags(config: ParamConfig): string[] {
		const tags: string[] = [];

		if (config.required) {
			tags.push(msg('cli:tagRequired'));
		}

		return tags;
	}

	renderCommands(commands: CommandConfigMap) {
		let pathWidth = 0;

		const items = Object.entries(commands).map(([path, command]) => {
			const pathCall = formatCommandCall(path, command);
			const pathCallStripped = stripAnsi(pathCall);

			if (pathCallStripped.length > pathWidth) {
				pathWidth = pathCallStripped.length;
			}

			return {
				...command,
				name: path,
				path,
				pathCall,
			};
		});

		const categorizedCommands = groupByCategory(items, this.props.categories ?? {});
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
									<Box flexGrow={0} width={pathWidth + SPACING_COL_WIDE}>
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

	renderOptions(options: OptionConfigMap) {
		let longWidth = 0;
		let shortWidth = 0;

		const items = Object.entries(options).map(([name, option]) => {
			const shortLabel = option.short ? `-${option.short},` : '';
			let longLabel = `--${option.default === true ? 'no-' : ''}${name}`;

			if (option.type !== 'boolean') {
				longLabel += ' ';
				longLabel += formatType(option);
			}

			const longLabelStripped = stripAnsi(longLabel);
			const shortLabelStripped = stripAnsi(shortLabel);

			if (longLabelStripped.length > longWidth) {
				longWidth = longLabelStripped.length;
			}

			if (shortLabelStripped.length > shortWidth) {
				shortWidth = shortLabelStripped.length;
			}

			return {
				...option,
				longLabel,
				name,
				shortLabel,
			};
		});

		const categorizedOptions = groupByCategory(items, this.props.categories ?? {});
		const categoryCount = Object.keys(categorizedOptions).length;
		const showShortColumn = shortWidth > 0;

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
									<Box flexGrow={0} width={shortWidth + SPACING_COL}>
										<Text>{config.shortLabel}</Text>
									</Box>
								)}

								<Box flexGrow={0} width={longWidth + SPACING_COL_WIDE}>
									<Text>{config.longLabel}</Text>
								</Box>

								<Box flexGrow={1}>
									<Text wrap="wrap">
										{formatDescription(config, this.gatherOptionTags(config))}
									</Text>
								</Box>
							</Box>
						))}
					</Box>
				))}
			</>
		);
	}

	renderParams(params: ParamConfigList) {
		const labels = params.map((config, index) => `${config.label ?? index} ${formatType(config)}`);
		const labelWidth = getLongestWidth(labels);
		const allowVariadic = this.props.config?.allowVariadicParams;

		return (
			<>
				<Header label={msg('cli:labelParams')} />

				{params.map((config, index) => {
					if (config.hidden) {
						return null;
					}

					const desc = config ? formatDescription(config, this.gatherParamTags(config)) : '';

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

	renderUsage(usage: string[] | string = '') {
		const { delimiter = DELIMITER } = this.props;

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

	// eslint-disable-next-line complexity
	render() {
		const { commands, options, header, params, config } = this.props;
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

				{hasUsage && this.renderUsage(config?.usage)}

				{hasParams && this.renderParams(params!)}

				{hasCommands && this.renderCommands(commands!)}

				{hasOptions && this.renderOptions(options!)}
			</Box>
		);
	}
}
