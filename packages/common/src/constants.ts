// https://github.com/npm/validate-npm-package-name
export const MODULE_NAME_PART = /[a-z0-9]{1}[-a-z0-9_.]*/u;

export const MODULE_NAME_PATTERN = new RegExp(
	`^(?:@(${MODULE_NAME_PART.source})/)?(${MODULE_NAME_PART.source})$`,
	'u',
);
