import React from 'react';
import { render } from 'ink-testing-library';
import { MultiSelect, MultiSelectProps } from '../../src/components/MultiSelect';
import { KEYS, options, optionsWithoutDivider } from '../helpers';

describe('MultiSelect', () => {
  const props: MultiSelectProps<string> = {
    label: 'Favorite color?',
    options: [],
    onSubmit() {},
  };

  describe('selection', () => {
    it('selects and displays a value when hitting space bar', () => {});

    it('can unselect a value when hitting space bar again', () => {});

    it('calls `onSubmit` with selected values when hitting enter', () => {});

    it('doesnt call `onSubmit` if validation fails', () => {});
  });
});
