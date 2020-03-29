/* eslint-disable react/jsx-curly-brace-presence */

import React from 'react';
import { Box } from 'ink';
import { ParseError, ValidationError } from '@boost/args';
import { figures, screen } from '@boost/terminal';
import Header from './Header';
import Style from './Style';
import { msg } from './constants';
import applyStyle from './helpers/applyStyle';
import { StyleType } from './types';

export interface FailureProps {
  commandLine?: string;
  error: Error;
  warnings?: Error[];
}

export default class Failure extends React.Component<FailureProps> {
  renderCodeFrame() {
    const { commandLine, error } = this.props;

    if (!commandLine) {
      return null;
    }

    const width = screen.size().columns;
    let type: StyleType = 'failure';
    let arg = '';
    let idx = 0;
    let cmd = commandLine;

    if (error instanceof ParseError) {
      arg = error.arg;
      idx = error.index;
    } else if (error instanceof ValidationError) {
      type = 'warning';
      arg = `--${error.option}`;
      idx = cmd.indexOf(arg);
    } else {
      return null;
    }

    while (idx + arg.length > width) {
      const half = Math.round(width / 2);

      cmd = `… ${cmd.slice(half + 2)}`;
      idx -= half;
    }

    if (cmd.length > width) {
      cmd = `${cmd.slice(0, width - 2)} …`;
    }

    return (
      <>
        <Box paddingLeft={2}>
          <Style type={type}>
            {'┌'.padStart(idx + 1, ' ')}
            {'─'.repeat(arg.length - 2)}
            {'┐'}
          </Style>
        </Box>

        <Box marginBottom={1} paddingLeft={2}>
          <Style type="muted">{cmd.replace(arg, applyStyle(arg, type))}</Style>
        </Box>
      </>
    );
  }

  renderStackTrace() {
    const { error } = this.props;

    if (!error.stack || process.env.NODE_ENV === 'test') {
      return null;
    }

    // Stack traces are not deterministic so we cannot snapshot this
    // istanbul ignore next
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
      <Box marginBottom={1} flexDirection="column">
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
      <Box marginTop={1} flexDirection="column">
        <Header label={msg('cli:labelError')} type="failure" />

        <Box marginBottom={1} paddingLeft={2}>
          {error.message}
        </Box>

        {this.renderCodeFrame()}

        {this.renderWarnings()}

        {this.renderStackTrace()}
      </Box>
    );
  }
}
