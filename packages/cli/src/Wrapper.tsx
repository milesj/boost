/* eslint-disable no-magic-numbers */

import React from 'react';
import { Box, Static } from 'ink';
import { Logger } from '@boost/log';
import Failure from './Failure';
import ProgramContext from './ProgramContext';
import { ProgramOptions, StreamType, ExitHandler } from './types';

export const BOUND_WRITERS = {
  stderr: process.stderr.write.bind(process.stderr),
  stdout: process.stdout.write.bind(process.stdout),
};

export const STREAM_TYPES: StreamType[] = ['stderr', 'stdout'];

export interface WrapperProps {
  exit: ExitHandler;
  logger: Logger;
  program: ProgramOptions;
}

export interface WrapperState {
  error: Error | null;
  log: string[];
}

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

    STREAM_TYPES.forEach(name => {
      if (this.wrapped[name]) {
        return;
      }

      process[name].write = (chunk: string) => {
        this.buffer.push(String(chunk));

        if (this.timer) {
          return true;
        }

        this.timer = setTimeout(() => {
          this.setState({ log: this.buffer }, () => {
            this.setState({ log: [] });
          });

          clearTimeout(this.timer!);
          this.buffer = [];
        }, 1000);

        return true;
      };

      this.wrapped[name] = true;
    });
  }

  /**
   * Unwrap the native console and reset it back to normal.
   */
  componentWillUnmount() {
    this.setState({
      log: this.buffer,
    });

    if (process.env.NODE_ENV === 'test') {
      return;
    }

    STREAM_TYPES.forEach(name => {
      if (!this.wrapped[name]) {
        return;
      }

      process[name].write = BOUND_WRITERS[name];

      this.wrapped[name] = false;
    });
  }

  render() {
    const { log, error } = this.state;
    const { children, exit, logger, program } = this.props;

    if (error) {
      return <Failure error={error} />;
    }

    return (
      <ProgramContext.Provider value={{ exit, log: logger, program }}>
        <Static>{log}</Static>
        <Box paddingY={1}>{children}</Box>
      </ProgramContext.Provider>
    );
  }
}
