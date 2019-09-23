/* eslint-disable no-param-reassign */

import { Scope } from '../types';

export default function updateScopeValue(scope: Scope, value: string) {
  const { config } = scope;

  // Append to array when capturing multiple values
  if (config.multiple) {
    if (!Array.isArray(scope.value)) {
      scope.value = [];
    }

    scope.value.push(value);

    return;
  }

  // Verify value against a list of choices
  if (Array.isArray(config.choices) && !config.choices.includes(value)) {
    throw new Error(
      `Invalid --${scope.name} value, must be one of ${config.choices.join(', ')}, found ${value}.`,
    );
  }

  scope.value = value;
}
