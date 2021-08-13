import coreDebug from 'debug';
import { toArray } from '@boost/common';
import { color, env } from '@boost/internal';
import { debug } from './debug';
import { Debugger } from './types';

/**
 * Create and return a `Debugger` instance with the defined namespace.
 */
export function createDebugger(namespace: string[] | string): Debugger {
	const globalNamespace = env('DEBUG_NAMESPACE');
	const namespaces = toArray(namespace);

	if (globalNamespace) {
		namespaces.unshift(globalNamespace);
	}

	const mainNamespace = namespaces.join(':');

	debug(
		'New debugger created: %s %s',
		mainNamespace,
		env('DEBUG_VERBOSE') ? '(verbose enabled)' : '',
	);

	const logger = coreDebug(mainNamespace) as Debugger;

	// `debug` doesn't support this on an individual namespace basis,
	// so we have to manually support it using this hacky regex.
	logger.disable = () => {
		debug('Debugger %s disabled', mainNamespace);

		process.env.DEBUG = (process.env.DEBUG ?? '')
			.replace(new RegExp(`${logger.namespace}(:\\*)?`, 'u'), '')
			.replace(/(^,)|(,$)/u, '')
			.replace(',,', ',');
	};

	logger.enable = () => {
		debug('Debugger %s enabled', mainNamespace);

		coreDebug.enable(mainNamespace);
	};

	logger.invariant = (condition, message, pass, fail) => {
		logger('%s: %s', message, condition ? color.pass(pass) : color.fail(fail));
	};

	logger.verbose = (message, ...args) => {
		if (env('DEBUG_VERBOSE')) {
			logger(message, ...args);
		}
	};

	return logger;
}
