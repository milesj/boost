import React from 'react';
import { Box } from 'ink';
import { LoggerFunction } from '@boost/log';
import Failure from './Failure';
import LogWriter, { LogWriterProps } from './LogWriter';
import ProgramContext from './ProgramContext';
import { ProgramOptions, ExitHandler } from './types';

export interface WrapperProps extends LogWriterProps {
  exit: ExitHandler;
  logger: LoggerFunction;
  program: ProgramOptions;
}

export interface WrapperState {
  error: Error | null;
}

export default class Wrapper extends React.Component<WrapperProps, WrapperState> {
  state: WrapperState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { children, exit, logger, program, errBuffer, outBuffer } = this.props;

    return (
      <Box>
        <ProgramContext.Provider value={{ exit, log: logger, program }}>
          {error ? (
            <Failure binName={program.bin} delimiter={program.delimiter} error={error} />
          ) : (
            children
          )}

          <LogWriter errBuffer={errBuffer} outBuffer={outBuffer} />
        </ProgramContext.Provider>
      </Box>
    );
  }
}
