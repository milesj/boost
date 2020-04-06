import React from 'react';
import { Box } from 'ink';
import { OptionConfig, OptionConfigMap, ParamConfig, ParamConfigList } from '@boost/args';
import { toArray } from '@boost/common';
import { screen } from '@boost/terminal';
import Header from './Header';
import { msg, SPACING_COL, SPACING_COL_WIDE } from './constants';
import { CommandConfigMap, CommandConfig } from './types';
import { formatType, getLongestWidth, formatDescription, formatCommandCall } from './helpers';

export interface HelpProps {
  config?: CommandConfig;
  commands?: CommandConfigMap;
  header?: string;
  options?: OptionConfigMap;
  params?: ParamConfigList;
}

function alphaSort(a: [string, unknown], b: [string, unknown]) {
  return a[0].localeCompare(b[0]);
}

export default class Help extends React.Component<HelpProps> {
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

  getWrapType(columnWidth: number, otherWidths: number): 'wrap' | undefined {
    return columnWidth + otherWidths > screen.size().columns ? 'wrap' : undefined;
  }

  renderCommands(commands: CommandConfigMap) {
    const entries = Object.entries(commands).sort(alphaSort);

    // Create column for names
    const names = entries.map(([path, config]) => formatCommandCall(path, config));

    // Calculate longest name column width
    const nameWidth = getLongestWidth(names);

    return (
      <>
        <Header label={msg('cli:labelCommands')} />

        {entries.map(([path, config], index) => {
          if (config.hidden) {
            return null;
          }

          const desc = formatDescription(config);

          return (
            <Box key={path} paddingLeft={SPACING_COL} flexDirection="row">
              <Box flexGrow={0} width={nameWidth + SPACING_COL_WIDE}>
                {names[index]}
              </Box>

              <Box flexGrow={1} textWrap={this.getWrapType(desc.length, nameWidth)}>
                {desc}
              </Box>
            </Box>
          );
        })}
      </>
    );
  }

  renderOptions(options: OptionConfigMap) {
    const entries = Object.entries(options).sort(alphaSort);

    // Create columns for the names and types
    const shortNames: string[] = [];
    const longNames: string[] = [];

    entries.forEach(([name, config]) => {
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
      <>
        <Header label={msg('cli:labelOptions')} />

        {entries.map(([name, config], index) => {
          if (config.hidden) {
            return null;
          }

          const desc = formatDescription(config, this.gatherOptionTags(config));
          const otherWidths = (showShortColumn ? shortWidth : 0) + longWidth;

          return (
            <Box key={name} paddingLeft={SPACING_COL} flexDirection="row">
              {showShortColumn && (
                <Box flexGrow={0} width={shortWidth + SPACING_COL}>
                  {shortNames[index]}
                </Box>
              )}

              <Box flexGrow={0} width={longWidth + SPACING_COL_WIDE}>
                {longNames[index]}
              </Box>

              <Box flexGrow={1} textWrap={this.getWrapType(desc.length, otherWidths)}>
                {desc}
              </Box>
            </Box>
          );
        })}
      </>
    );
  }

  renderParams(params: ParamConfigList) {
    const labels = params.map((config, index) => `${config.label || index} ${formatType(config)}`);
    const labelWidth = getLongestWidth(labels);

    return (
      <>
        <Header label={msg('cli:labelParams')} />

        {params.map((config, index) => {
          if (config.hidden) {
            return null;
          }

          const desc = config ? formatDescription(config, this.gatherParamTags(config)) : '';

          return (
            <Box key={`${labels[index]}-${index}`} paddingLeft={SPACING_COL} flexDirection="row">
              <Box flexGrow={0} width={labelWidth + SPACING_COL_WIDE}>
                {labels[index]}
              </Box>

              <Box flexGrow={1} textWrap={this.getWrapType(desc.length, labelWidth)}>
                {desc}
              </Box>
            </Box>
          );
        })}

        <Box paddingLeft={SPACING_COL}>
          <Box>{`… ${formatType({ multiple: true, type: 'string' })}`}</Box>
        </Box>
      </>
    );
  }

  renderUsage(usage: string | string[]) {
    return (
      <>
        <Header label={msg('cli:labelUsage')} />

        {toArray(usage).map(example => (
          <Box key={example} paddingLeft={SPACING_COL}>
            {example}
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

        {hasDesc && <Box paddingLeft={SPACING_COL}>{formatDescription(config!)}</Box>}

        {hasUsage && this.renderUsage(config?.usage!)}

        {hasParams && this.renderParams(params!)}

        {hasCommands && this.renderCommands(commands!)}

        {hasOptions && this.renderOptions(options!)}
      </Box>
    );
  }
}
