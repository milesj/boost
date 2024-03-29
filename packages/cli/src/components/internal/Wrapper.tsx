import { Component, type ReactNode } from 'react';
import { Box } from 'ink';
import { ProgramContext } from '../../ProgramContext';
import type { ProgramContextType } from '../../types';
import { Failure } from '../Failure';
import { LogWriter, type LogWriterProps } from './LogWriter';

export interface WrapperProps extends LogWriterProps, ProgramContextType {
	children: ReactNode;
}

export interface WrapperState {
	error: Error | null;
}

export class Wrapper extends Component<WrapperProps, WrapperState> {
	override state: WrapperState = {
		error: null,
	};

	value?: ProgramContextType;

	static getDerivedStateFromError(error: Error) {
		return { error };
	}

	override componentDidCatch(error: Error) {
		this.setState({ error });
	}

	override render() {
		const { error } = this.state;
		const { children, exit, log, program, errBuffer, outBuffer } = this.props;

		if (!this.value) {
			this.value = { exit, log, program };
		}

		return (
			<ProgramContext.Provider value={this.value}>
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
