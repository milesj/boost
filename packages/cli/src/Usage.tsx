import React from 'react';
import { Box } from 'ink';
import { ParamConfig } from '@boost/args';
import Header from './Header';
import { CommandMetadata } from './types';
import { formatType, getLongestWidth, formatDescription } from './helpers';

export interface UsageProps {
  metadata: CommandMetadata;
}

export default class Usage extends React.Component<UsageProps> {
  gatherParamTags(config: ParamConfig): string[] {
    const tags: string[] = [];

    if (config.required) {
      tags.push('required');
    }

    return tags;
  }

  renderParams(params: CommandMetadata['params']) {
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

        {labels.map((label, index) => {
          const config: ParamConfig | undefined = params[index];

          if (config?.hidden) {
            return null;
          }

          return (
            <Box key={`${label}-${index}`} width="100%">
              <Box width={labelWidth} paddingLeft={2} alignItems="flex-end">
                {label}
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
    const { commands, options, params, usage } = this.props.metadata;

    return <Box flexDirection="column">{params && this.renderParams(params)}</Box>;
  }
}
