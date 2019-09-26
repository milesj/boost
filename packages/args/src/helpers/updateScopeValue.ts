/* eslint-disable no-param-reassign */

import { Scope } from '../types';

export default function updateScopeValue(scope: Scope, value: string) {
  if (scope.config.multiple) {
    if (!Array.isArray(scope.value)) {
      scope.value = [];
    }

    scope.value.push(value);
  } else {
    scope.value = value;
  }
}
