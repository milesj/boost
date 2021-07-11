import React from 'react';
import { Box } from 'ink';
import ProgramContext from '../../ProgramContext';
import { ProgramContextType } from '../../types';
import { Failure } from '../Failure';
import { LogWriter, LogWriterProps } from './LogWriter';

export interface WrapperProps extends LogWriterProps, ProgramContextType {
	children: React.ReactNode;
}

export interface WrapperState {
	error: Error | null;
}

export class Wrapper extends React.Component<WrapperProps, WrapperState> {
	state: WrapperState = {
		error: null,
	};

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	componentDidCatch(error: Error) {
		this.setState({ error });
	}

	render() {
		const { error } = this.state;
		const { children, exit, log, program, errBuffer, outBuffer } = this.props;

		return (
			<ProgramContext.Provider value={{ exit, log, program }}>
				<Box>
					{error ? (
						<Failure binName={program.bin} delimiter={program.delimiter} error={error} />
					) : (
						children
					)}

					<LogWriter errBuffer={errBuffer} outBuffer={outBuffer} />
				</Box>
			</ProgramContext.Provider>
		);
	}
}
