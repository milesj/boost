import { CommandChecker } from '../types';

/**
 * Check that an argument is a command by looping through a list of available
 * commands, or running a command checking function. If an exact match,
 * or looks like a sub-command ("cmd:sub") return true.
 */
export function isCommand(arg: string, commandCheck: CommandChecker | string[]): boolean {
	if (Array.isArray(commandCheck) && commandCheck.length > 0) {
		return commandCheck.includes(arg);
	}

	if (typeof commandCheck === 'function') {
		return commandCheck(arg);
	}

	return false;
}
