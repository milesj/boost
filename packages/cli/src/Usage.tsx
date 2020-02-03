import React from 'react';
import { Box } from 'ink';
import { OptionConfig, OptionConfigMap, ParamConfig, ParamConfigList } from '@boost/args';
import Header from './Header';
import { CommandMetadataMap, CommandConstructorMetadata } from './types';
import { formatType, getLongestWidth, formatDescription, formatCommandCall } from './helpers';

export interface UsageProps {
  config: CommandConstructorMetadata;
  commands: CommandMetadataMap;
  options: OptionConfigMap;
  params: ParamConfigList;
}

export default class Usage extends React.Component<UsageProps> {
  gatherOptionTags(config: OptionConfig): string[] {
    const tags: string[] = [];

    if (config.count) {
      tags.push('counter');
    }

    if (config.multiple) {
      tags.push(`multiple${config.arity ? `(${config.arity})` : ''}`);
    }

    return tags;
  }

  gatherParamTags(config: ParamConfig): string[] {
    const tags: string[] = [];

    if (config.required) {
      tags.push('required');
    }

    return tags;
  }

  renderCommands(commands: CommandMetadataMap) {
    // Create column for names
    const names = Object.entries(commands).map(([path, config]) => formatCommandCall(path, config));

    // Calculate longest column width
    const nameWidth = getLongestWidth(names);

    return (
      <Box>
        <Header label="Commands" />

        {Object.entries(commands).map(([path, config], index) => {
          if (config.hidden) {
            return null;
          }

          return (
            <Box key={`${path}-${index}`} width="100%">
              <Box width={nameWidth} paddingLeft={2} alignItems="flex-end">
                {names[index]}
              </Box>

              <Box flexGrow={1} paddingLeft={2} textWrap="wrap">
                {formatDescription(config)}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  renderOptions(options: OptionConfigMap) {
    // Create columns for the names and types
    const shortNames: string[] = [];
    const longNames: string[] = [];

    Object.entries(options).forEach(([name, config]) => {
      if (config.short) {
        shortNames.push(`-${config.short},`);
      } else {
        shortNames.push('');
      }

      let long = `--${config.default === true ? 'no-' : ''}${name}`;

      if (config.type !== 'boolean') {
        long += ' ';
        long += formatType(config);
      }

      longNames.push(long);
    });

    // Calculate column widths
    const shortWidth = getLongestWidth(shortNames);
    const longWidth = getLongestWidth(longNames);
    const showShortColumn = shortWidth > 0;

    return (
      <Box>
        <Header label="Options" />

        {Object.entries(options).map(([name, config], index) => {
          if (config.hidden) {
            return null;
          }

          return (
            <Box key={`${name}-${index}`} width="100%">
              {showShortColumn && (
                <Box width={shortWidth} paddingLeft={2}>
                  {shortNames[index]}
                </Box>
              )}

              <Box width={longWidth} paddingLeft={showShortColumn ? 1 : 2}>
                {longNames[index]}
              </Box>

              <Box flexGrow={1} paddingLeft={2} textWrap="wrap">
                {formatDescription(config, this.gatherOptionTags(config))}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  renderParams(params: ParamConfigList) {
    // Create columns and append the "rest bucket"
    const labels = [...params.map((config, index) => String(config.label || index)), '…'];
    const types = [
      ...params.map(config => formatType(config)),
      formatType({ multiple: true, type: 'string' }),
    ];

    // Calculate column widths
    const labelWidth = getLongestWidth(labels);
    const typeWidth = getLongestWidth(types);

    return (
      <Box>
        <Header label="Params" />

        {params.map((config, index) => {
          if (config.hidden) {
            return null;
          }

          return (
            <Box key={`${labels[index]}-${index}`} width="100%">
              <Box width={labelWidth} paddingLeft={2} alignItems="flex-end">
                {labels[index]}
              </Box>

              <Box width={typeWidth} paddingLeft={1}>
                {types[index]}
              </Box>

              <Box flexGrow={1} paddingLeft={2} textWrap="wrap">
                {config ? formatDescription(config, this.gatherParamTags(config)) : ''}
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  render() {
    const { commands, options, params, config } = this.props;

    return (
      <Box>
        <Box>{formatDescription(config)}</Box>

        {params && this.renderParams(params)}

        {commands && this.renderCommands(commands)}

        {options && this.renderOptions(options)}
      </Box>
    );
  }
}
