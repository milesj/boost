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
  command?: string;
  error: Error;
  warnings?: Error[];
}

export default class Failure extends React.Component<FailureProps> {
  renderCodeFrame() {
    const { command, error } = this.props;

    if (!command) {
      return null;
    }

    const width = screen.size().columns;
    let type: StyleType = 'failure';
    let arg = '';
    let idx = 0;
    let cmd = command;

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

    while (idx > width) {
      cmd = command.slice(width / 2);
      idx -= width / 2;
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

        <Box paddingLeft={2}>
          <Style type="muted">{cmd.replace(arg, applyStyle(arg, type))}</Style>
        </Box>
      </>
    );
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
