import { useEffect } from 'react';
import { useStdout, useStderr } from 'ink';
import LogBuffer from '../../LogBuffer';

export interface LogWriterProps {
  errBuffer: LogBuffer;
  outBuffer: LogBuffer;
}

export function LogWriter({ errBuffer, outBuffer }: LogWriterProps) {
  const { write: writeErr } = useStderr();
  const { write: writeOut } = useStdout();

  useEffect(() => {
    return errBuffer.on(writeErr);
  }, [errBuffer, writeErr]);

  useEffect(() => {
    return outBuffer.on(writeOut);
  }, [outBuffer, writeOut]);

  return null;
}
