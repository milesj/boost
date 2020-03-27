/* eslint-disable no-magic-numbers */

import React from 'react';
import { Box, Static } from 'ink';
import { Logger } from '@boost/log';
import Failure from './Failure';
import ProgramContext from './ProgramContext';
// import { BOUND_STREAMS, STREAM_TYPES } from './constants';
import { ProgramOptions, ExitHandler } from './types';

export interface WrapperProps {
  exit: ExitHandler;
  logger: Logger;
  program: ProgramOptions;
}

export interface WrapperState {
  error: Error | null;
  log: string[];
}

const CONSOLE_METHODS: (keyof typeof console)[] = ['log', 'error', 'warn', 'info'];

export default class Wrapper extends React.Component<WrapperProps, WrapperState> {
  buffer: string[] = [];

  state: WrapperState = {
    error: null,
    log: [],
  };

  timer?: NodeJS.Timeout;

  wrapped = {
    stderr: false,
    stdout: false,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  /**
   * Wrap the `stdout` and `stderr` streams and buffer the output.
   */
  componentDidMount() {
    if (process.env.NODE_ENV === 'test') {
      return;
    }

    CONSOLE_METHODS.forEach(method => {
      const old = console[method].bind(console);

      console[method] = (...chunks: string[]) => {
        this.buffer.push(chunks.join(' '));

        if (this.timer) {
          return;
        }

        this.timer = setTimeout(() => {
          this.setState({ log: this.buffer }, () => {
            this.setState({ log: [] });
          });

          clearTimeout(this.timer!);

          this.buffer = [];
        }, 1000);

        return;
      };

      console[method].old = old;
    });
  }

  /**
   * Unwrap the native console and reset it back to normal.
   */
  componentWillUnmount() {
    this.setState({
      log: this.buffer,
    });

    CONSOLE_METHODS.forEach(method => {
      console[method] = console[method].old;
    });
  }

  render() {
    const { log, error } = this.state;
    const { children, exit, logger, program } = this.props;

    if (error) {
      return <Failure error={error} />;
    }

    return (
      <Box>
        <ProgramContext.Provider value={{ exit, log: logger, program }}>
          <Static>{log}</Static>
          <Box paddingY={1}>{children}</Box>
        </ProgramContext.Provider>
      </Box>
    );
  }
}
