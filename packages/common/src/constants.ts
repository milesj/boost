// https://github.com/npm/validate-npm-package-name
export const MODULE_NAME_PART = /[a-z0-9]{1}[-a-z0-9_.]*/u;

// eslint-disable-next-line security/detect-non-literal-regexp
export const MODULE_NAME_PATTERN = new RegExp(
  `^(?:@(${MODULE_NAME_PART.source})/)?(${MODULE_NAME_PART.source})$`,
  'u',
);
