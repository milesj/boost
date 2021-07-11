import { LOCALE_FORMAT } from '../constants';
import { msg } from '../translate';
import { OptionConfigMap } from '../types';

export const globalOptions: OptionConfigMap = {
	help: {
		category: 'global',
		description: msg('cli:optionHelpDescription'),
		short: 'h',
		type: 'boolean',
	},
	locale: {
		category: 'global',
		default: 'en',
		description: msg('cli:optionLocaleDescription'),
		type: 'string',
		validate(value: string) {
			if (value && !value.match(LOCALE_FORMAT)) {
				throw new Error(msg('cli:errorInvalidLocale'));
			}
		},
	},
	version: {
		category: 'global',
		description: msg('cli:optionVersionDescription'),
		short: 'v',
		type: 'boolean',
	},
};
