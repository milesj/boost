/* eslint-disable no-param-reassign */

import { Scope } from '../types';
import ParseError from '../ParseError';

function updateMultipleValues(scope: Scope, value: string) {
  // Create array if none set yet
  if (!Array.isArray(scope.value)) {
    scope.value = [];
  }

  scope.value.push(value);
}

function updateSingleValue(scope: Scope, value: string) {
  const { config } = scope;

  // Verify value against a list of choices
  if (Array.isArray(config.choices) && !config.choices.includes(value)) {
    throw new ParseError(
      `Invalid value, must be one of ${config.choices.join(', ')}, found ${value}.`,
      scope.arg,
    );
  }

  scope.value = value;
}

export default function updateScopeValue(scope: Scope, value: string) {
  if (scope.config.multiple) {
    updateMultipleValues(scope, value);
  } else {
    updateSingleValue(scope, value);
  }
}
