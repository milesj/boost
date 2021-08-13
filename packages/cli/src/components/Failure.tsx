/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable react/jsx-curly-brace-presence */

import React from 'react';
import { Box, Text } from 'ink';
import { ParseError, ValidationError } from '@boost/args';
import { ExitError } from '@boost/common';
import { screen } from '@boost/terminal';
import { CLIError } from '../CLIError';
import { DELIMITER, SPACING_COL, SPACING_ROW } from '../constants';
import { applyStyle } from '../helpers/applyStyle';
import { msg } from '../translate';
import { StyleType } from '../types';
import { Header } from './Header';
import { Style } from './Style';

export interface FailureProps {
	/** Name of the binary being executed. */
	binName?: string;
	/** Full length command line being ran. */
	commandLine?: string;
	/** Delimiter to prefix within examples. Defaults to "$ ". */
	delimiter?: string;
	/** The primary error to display in red. */
	error: Error;
	/** Hide the primary error stack trace. Defaults to `false`. */
	hideStackTrace?: boolean;
	/** Optional errors as warnings to display in yellow. */
	warnings?: Error[];
}

/**
 * A React component that renders a failure state for errors and warnings.
 */
export class Failure extends React.Component<FailureProps> {
	shouldHideStackTrace() {
		const { error, hideStackTrace } = this.props;

		return (
			hideStackTrace ||
			!error.stack ||
			error instanceof ExitError ||
			error instanceof ParseError ||
			error instanceof ValidationError ||
			error instanceof CLIError ||
			process.env.NODE_ENV === 'test'
		);
	}

	renderCodeFrame() {
		const { binName, commandLine, delimiter = DELIMITER, error } = this.props;

		if (!binName || !commandLine) {
			return null;
		}

		const width = screen.size().columns;
		let type: StyleType = 'failure';
		let cmd = `${delimiter}${binName} ${commandLine}`;
		let arg = '';

		if (error instanceof ParseError) {
			({ arg } = error);
		} else if (error instanceof ValidationError) {
			type = 'warning';
			arg = `--${error.option}`;
		} else {
			return null;
		}

		let idx = cmd.indexOf(arg);

		if (idx < 0) {
			return null;
		}

		while (idx + arg.length > width) {
			const half = Math.round(width / 2);

			cmd = `… ${cmd.slice(half + 2)}`;
			idx -= half;
		}

		if (cmd.length > width) {
			cmd = `${cmd.slice(0, width - 2)} …`;
		}

		return (
			<>
				<Box marginTop={SPACING_ROW}>
					<Style type="muted">{cmd.replace(arg, applyStyle(arg, type))}</Style>
				</Box>

				<Box>
					<Style type={type}>
						{'└'.padStart(idx + 1, ' ')}
						{'─'.repeat(arg.length - 2)}
						{'┘'}
					</Style>
				</Box>
			</>
		);
	}

	renderStackTrace() {
		const { error } = this.props;

		if (this.shouldHideStackTrace()) {
			return null;
		}

		// Stack traces are not deterministic so we cannot snapshot this
		// istanbul ignore next
		return (
			<>
				<Header label={msg('cli:labelStackTrace')} type="muted" />

				<Box width="100%">
					<Style type="muted">
						{error.stack!.replace(`${error.constructor.name}: ${error.message}\n`, '')}
					</Style>
				</Box>
			</>
		);
	}

	renderWarnings() {
		const { warnings = [] } = this.props;

		if (warnings.length === 0) {
			return null;
		}

		return (
			<>
				<Header label={msg('cli:labelWarnings')} type="warning" />

				{warnings.map((warn) => (
					<Box key={warn.message} flexDirection="row" paddingLeft={SPACING_COL}>
						<Box width={2}>
							<Text>{'–'}</Text>
						</Box>
						<Box flexGrow={1}>
							<Text>{warn.message}</Text>
						</Box>
					</Box>
				))}
			</>
		);
	}

	override render() {
		const { error } = this.props;

		return (
			<Box flexDirection="column" marginBottom={1}>
				<Header label={msg('cli:labelError')} type="failure" />

				<Box flexDirection="column" paddingLeft={SPACING_COL}>
					<Box>
						<Text>{error.message}</Text>
					</Box>

					{this.renderCodeFrame()}
				</Box>

				{this.renderWarnings()}

				{this.renderStackTrace()}
			</Box>
		);
	}
}
