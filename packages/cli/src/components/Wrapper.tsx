import React from 'react';
import { Box } from 'ink';
import LogWriter, { LogWriterProps } from './LogWriter';
import ProgramContext from '../ProgramContext';
import { ProgramContextType } from '../types';

export interface WrapperProps extends LogWriterProps, ProgramContextType {
  children: React.ReactNode;
}

export default function Wrapper({
  children,
  exit,
  log,
  program,
  errBuffer,
  outBuffer,
}: WrapperProps) {
  return (
    <ProgramContext.Provider value={{ exit, log, program }}>
      <Box>{children}</Box>

      <LogWriter errBuffer={errBuffer} outBuffer={outBuffer} />
    </ProgramContext.Provider>
  );
}
