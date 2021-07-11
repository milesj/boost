import { useEffect } from 'react';
import { useStderr, useStdout } from 'ink';
import { LogBuffer } from '../../LogBuffer';

export interface LogWriterProps {
	errBuffer: LogBuffer;
	outBuffer: LogBuffer;
}

export function LogWriter({ errBuffer, outBuffer }: LogWriterProps) {
	const { write: writeErr } = useStderr();
	const { write: writeOut } = useStdout();

	useEffect(() => errBuffer.on(writeErr), [errBuffer, writeErr]);

	useEffect(() => outBuffer.on(writeOut), [outBuffer, writeOut]);

	return null;
}
