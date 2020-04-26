import React from 'react';
import { Box } from 'ink';
import { Logger } from '@boost/log';
import Failure from './Failure';
import ProgramContext from './ProgramContext';
import { ProgramOptions, ExitHandler } from './types';

export interface WrapperProps {
  exit: ExitHandler;
  logger: Logger;
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
    const { children, exit, logger, program } = this.props;

    return (
      <Box>
        <ProgramContext.Provider value={{ exit, log: logger, program }}>
          {error ? (
            <Failure binName={program.bin} delimiter={program.delimiter} error={error} />
          ) : (
            children
          )}
        </ProgramContext.Provider>
      </Box>
    );
  }
}
