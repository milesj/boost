import React from 'react';
import { Box, Static } from 'ink';
import { Logger } from '@boost/log';
import Failure from './Failure';
import ProgramContext from './ProgramContext';
import { ProgramOptions, ExitHandler } from './types';
import LogBuffer from './LogBuffer';

export interface WrapperProps {
  errBuffer: LogBuffer;
  exit: ExitHandler;
  logger: Logger;
  outBuffer: LogBuffer;
  program: ProgramOptions;
}

export interface WrapperState {
  errLogs: string[];
  error: Error | null;
  outLogs: string[];
}

export default class Wrapper extends React.Component<WrapperProps, WrapperState> {
  state: WrapperState = {
    errLogs: [],
    error: null,
    outLogs: [],
  };

  wrapped = {
    stderr: false,
    stdout: false,
  };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidMount() {
    this.props.errBuffer.on(errLogs => {
      this.setState({ errLogs }, () => {
        this.setState({ errLogs: [] });
      });
    });

    this.props.outBuffer.on(outLogs => {
      this.setState({ outLogs }, () => {
        this.setState({ outLogs: [] });
      });
    });
  }

  componentWillUnmount() {
    this.props.errBuffer.off();
    this.props.outBuffer.off();
  }

  render() {
    const { error, errLogs, outLogs } = this.state;
    const { children, exit, logger, program } = this.props;

    return (
      <Box>
        <ProgramContext.Provider value={{ exit, log: logger, program }}>
          <Static>{[...errLogs, ...outLogs]}</Static>

          {error ? <Failure error={error} /> : <Box>{children}</Box>}
        </ProgramContext.Provider>
      </Box>
    );
  }
}
