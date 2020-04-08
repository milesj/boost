import React from 'react';
import { Box } from 'ink';
import { OptionConfig, OptionConfigMap, ParamConfig, ParamConfigList } from '@boost/args';
import { toArray } from '@boost/common';
import { screen, stripAnsi } from '@boost/terminal';
import Header from './Header';
import Style from './Style';
import { msg, SPACING_COL, SPACING_COL_WIDE, SPACING_ROW } from './constants';
import { CommandConfigMap, CommandConfig, Categories } from './types';
import {
  formatType,
  getLongestWidth,
  groupByCategory,
  formatDescription,
  formatCommandCall,
} from './helpers';

export interface HelpProps {
  categories?: Categories;
  config?: CommandConfig;
  commands?: CommandConfigMap;
  header?: string;
  options?: OptionConfigMap;
  params?: ParamConfigList;
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

    const categorizedCommands = groupByCategory(items, this.props.categories || {});
    const categoryCount = Object.keys(categorizedCommands).length;

    return (
      <>
        <Header label={msg('cli:labelCommands')} />

        {Object.entries(categorizedCommands).map(([key, category], index) => (
          <Box key={key} flexDirection="column">
            {category.name && categoryCount > 1 && (
              <Box marginTop={index === 0 ? 0 : SPACING_ROW} paddingLeft={SPACING_COL}>
                <Style bold type="none">
                  {category.name}
                </Style>
              </Box>
            )}

            {category.items.map(config => {
              const desc = formatDescription(config);

              return (
                <Box key={key + config.path} paddingLeft={SPACING_COL} flexDirection="row">
                  <Box flexGrow={0} width={pathWidth + SPACING_COL_WIDE}>
                    {config.pathCall}
                  </Box>

                  <Box flexGrow={1} textWrap={this.getWrapType(desc.length, pathWidth)}>
                    {desc}
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

    const categorizedOptions = groupByCategory(items, this.props.categories || {});
    const categoryCount = Object.keys(categorizedOptions).length;
    const showShortColumn = shortWidth > 0;

    return (
      <>
        <Header label={msg('cli:labelOptions')} />

        {Object.entries(categorizedOptions).map(([key, category], index) => (
          <Box key={key} flexDirection="column">
            {category.name && categoryCount > 1 && (
              <Box marginTop={index === 0 ? 0 : SPACING_ROW} paddingLeft={SPACING_COL}>
                <Style bold type="none">
                  {category.name}
                </Style>
              </Box>
            )}

            {category.items.map(config => {
              const desc = formatDescription(config, this.gatherOptionTags(config));
              const otherWidths = (showShortColumn ? shortWidth : 0) + longWidth;

              return (
                <Box key={key + config.name} paddingLeft={SPACING_COL} flexDirection="row">
                  {showShortColumn && (
                    <Box flexGrow={0} width={shortWidth + SPACING_COL}>
                      {config.shortLabel}
                    </Box>
                  )}

                  <Box flexGrow={0} width={longWidth + SPACING_COL_WIDE}>
                    {config.longLabel}
                  </Box>

                  <Box flexGrow={1} textWrap={this.getWrapType(desc.length, otherWidths)}>
                    {desc}
                  </Box>
                </Box>
              );
            })}
          </Box>
        ))}
      </>
    );
  }

  renderParams(params: ParamConfigList) {
    const labels = params.map((config, index) => `${config.label || index} ${formatType(config)}`);
    const labelWidth = getLongestWidth(labels);
    const allowRest = this.props.config?.allowRestParams;

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

        {allowRest && (
          <Box paddingLeft={SPACING_COL}>
            <Box>
              {`…${typeof allowRest === 'string' ? allowRest : ''}`}{' '}
              {formatType({
                multiple: true,
                type: 'string',
              })}
            </Box>
          </Box>
        )}
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
