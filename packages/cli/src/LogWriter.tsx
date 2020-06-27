import { useEffect } from 'react';
import { useStdout, useStderr } from 'ink';
import LogBuffer from './LogBuffer';

export interface LogWriterProps {
  errBuffer: LogBuffer;
  outBuffer: LogBuffer;
}

export default function LogWriter({ errBuffer, outBuffer }: LogWriterProps) {
  const { write: writeErr } = useStderr();
  const { write: writeOut } = useStdout();

  useEffect(() => {
    errBuffer.on((logs) => {
      logs.forEach(writeErr);
    });

    return () => {
      errBuffer.off();
    };
  }, [errBuffer, writeErr]);

  useEffect(() => {
    outBuffer.on((logs) => {
      logs.forEach(writeOut);
    });

    return () => {
      outBuffer.off();
    };
  }, [outBuffer, writeOut]);

  return null;
}
