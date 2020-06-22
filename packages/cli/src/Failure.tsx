/* eslint-disable react/jsx-curly-brace-presence */

import React from 'react';
import { Box } from 'ink';
import { ParseError, ValidationError } from '@boost/args';
import { screen } from '@boost/terminal';
import CLIError from './CLIError';
import Header from './Header';
import Style from './Style';
import { SPACING_COL, SPACING_ROW, DELIMITER } from './constants';
import applyStyle from './helpers/applyStyle';
import msg from './translate';
import { StyleType } from './types';

export interface FailureProps {
  binName?: string;
  commandLine?: string;
  delimiter?: string;
  error: Error;
  warnings?: Error[];
}

export default class Failure extends React.Component<FailureProps> {
  renderCodeFrame() {
    const { binName, commandLine, delimiter = DELIMITER, error } = this.props;

    if (!binName || !commandLine) {
      return null;
    }

    const width = screen.size().columns;
    let type: StyleType = 'failure';
    let cmd = `${delimiter}${binName} ${commandLine}`;
    let arg = '';

    if (error instanceof ParseError) {
      arg = error.arg;
    } else if (error instanceof ValidationError) {
      type = 'warning';
      arg = `--${error.option}`;
    } else {
      return null;
    }

    let idx = cmd.indexOf(arg);

    if (idx < 0) {
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
        <Box marginTop={SPACING_ROW}>
          <Style type="muted">{cmd.replace(arg, applyStyle(arg, type))}</Style>
        </Box>

        <Box>
          <Style type={type}>
            {'└'.padStart(idx + 1, ' ')}
            {'─'.repeat(arg.length - 2)}
            {'┘'}
          </Style>
        </Box>
      </>
    );
  }

  renderStackTrace() {
    const { error } = this.props;

    if (
      !error.stack ||
      error instanceof ParseError ||
      error instanceof ValidationError ||
      error instanceof CLIError ||
      process.env.NODE_ENV === 'test'
    ) {
      return null;
    }

    // Stack traces are not deterministic so we cannot snapshot this
    // istanbul ignore next
    return (
      <>
        <Header label={msg('cli:labelStackTrace')} type="muted" />

        <Box width="100%">
          <Style type="muted">
            {error.stack!.replace(`${error.constructor.name}: ${error.message}\n`, '')}
          </Style>
        </Box>
      </>
    );
  }

  renderWarnings() {
    const { warnings = [] } = this.props;

    if (warnings.length === 0) {
      return null;
    }

    return (
      <>
        <Header label={msg('cli:labelWarnings')} type="warning" />

        {warnings.map((warn) => (
          <Box key={warn.message} paddingLeft={SPACING_COL} flexDirection="row">
            <Box width={2}>{'–'}</Box>
            <Box flexGrow={1}>{warn.message}</Box>
          </Box>
        ))}
      </>
    );
  }

  render() {
    const { error } = this.props;

    return (
      <Box flexDirection="column">
        <Header label={msg('cli:labelError')} type="failure" />

        <Box paddingLeft={SPACING_COL} flexDirection="column">
          <Box>{error.message}</Box>
          {this.renderCodeFrame()}
        </Box>

        {this.renderWarnings()}

        {this.renderStackTrace()}
      </Box>
    );
  }
}
