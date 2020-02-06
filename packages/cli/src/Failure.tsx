import React from 'react';
import { Box } from 'ink';
import { ParseError } from '@boost/args';
import { figures } from '@boost/terminal';
import Header from './Header';
import Style from './Style';
import { msg } from './constants';
import applyStyle from './helpers/applyStyle';

export interface FailureProps {
  command: string;
  error: Error;
  warnings?: Error[];
}

export default class Failure extends React.Component<FailureProps> {
  renderCodeFrame() {
    const { command, error } = this.props;

    if (error instanceof ParseError) {
      return (
        <>
          <Box paddingLeft={4}>
            <Style type="failure">
              {'┌'.padStart(error.index + 1, ' ')}
              {'─'.repeat(error.arg.length - 2)}
              {'┐'}
            </Style>
          </Box>

          <Box paddingLeft={4}>
            <Style type="muted">
              {command.replace(error.arg, applyStyle(error.arg, 'failure'))}
            </Style>
          </Box>
        </>
      );
    }

    return null;
  }

  renderStackTrace() {
    const { error } = this.props;

    if (!error.stack) {
      return null;
    }

    return (
      <Box flexDirection="column">
        <Header label={msg('cli:labelStackTrace')} type="muted" />

        <Box width="100%">
          <Style type="muted">
            {error.stack.replace(`${error.constructor.name}: ${error.message}\n`, '')}
          </Style>
        </Box>
      </Box>
    );
  }

  renderWarnings() {
    const { warnings = [] } = this.props;

    if (warnings.length === 0) {
      return null;
    }

    return (
      <Box flexDirection="column">
        <Header label={msg('cli:labelWarnings')} type="warning" />

        {warnings.map(warn => (
          <Box key={warn.message} paddingLeft={2} flexDirection="row">
            <Box width={2}>{figures.bullet}</Box>
            <Box flexGrow={1}>{warn.message}</Box>
          </Box>
        ))}
      </Box>
    );
  }

  render() {
    const { error } = this.props;

    return (
      <Box flexDirection="column" paddingY={1}>
        <Header label={msg('cli:labelError')} type="failure" />

        <Box paddingLeft={2}>{error.message}</Box>

        {this.renderCodeFrame()}

        {this.renderWarnings()}

        {this.renderStackTrace()}
      </Box>
    );
  }
}
