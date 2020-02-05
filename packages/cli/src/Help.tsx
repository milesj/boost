import React from 'react';
import { Box } from 'ink';
import { OptionConfig, OptionConfigMap, ParamConfig, ParamConfigList } from '@boost/args';
import { toArray } from '@boost/common';
import Header from './Header';
import { CommandMetadataMap, CommandStaticMetadata } from './types';
import { formatType, getLongestWidth, formatDescription, formatCommandCall } from './helpers';

export interface HelpProps {
  config?: CommandStaticMetadata;
  commands?: CommandMetadataMap;
  options?: OptionConfigMap;
  params?: ParamConfigList;
}

export default class Help extends React.Component<HelpProps> {
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
      <Box flexDirection="column">
        <Header label="Commands" />

        {Object.entries(commands).map(([path, config], index) => {
          if (config.hidden) {
            return null;
          }

          return (
            <Box key={`${path}-${index}`} flexDirection="row">
              <Box width={nameWidth + 2} paddingLeft={2} alignItems="flex-end">
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
      <Box flexDirection="column">
        <Header label="Options" />

        {Object.entries(options).map(([name, config], index) => {
          if (config.hidden) {
            return null;
          }

          const indent = showShortColumn ? 1 : 2;

          return (
            <Box key={`${name}-${index}`} flexDirection="row">
              {showShortColumn && (
                <Box width={shortWidth + 2} paddingLeft={2}>
                  {shortNames[index]}
                </Box>
              )}

              <Box width={longWidth + indent} paddingLeft={indent}>
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
      <Box flexDirection="column">
        <Header label="Params" />

        {params.map((config, index) => {
          if (config.hidden) {
            return null;
          }

          return (
            <Box key={`${labels[index]}-${index}`} flexDirection="row">
              <Box width={labelWidth + 2} paddingLeft={2} justifyContent="flex-end">
                {labels[index]}
              </Box>

              <Box width={typeWidth + 1} paddingLeft={1}>
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

  renderUsage(usage: string | string[]) {
    if (!usage || usage.length === 0) {
      return null;
    }

    return (
      <Box flexDirection="column">
        <Header label="Usage" />

        {toArray(usage).map(example => (
          <Box key={example} paddingLeft={2}>
            {example}
          </Box>
        ))}
      </Box>
    );
  }

  render() {
    const { commands, options, params, config } = this.props;

    return (
      <Box flexDirection="column" paddingY={1}>
        {config && <Box>{formatDescription(config)}</Box>}

        {config?.usage && this.renderUsage(config.usage)}

        {params && this.renderParams(params)}

        {commands && this.renderCommands(commands)}

        {options && this.renderOptions(options)}
      </Box>
    );
  }
}
