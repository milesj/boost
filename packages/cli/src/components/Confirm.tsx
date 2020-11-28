import React, { useCallback, useEffect, useState } from 'react';
import { useFocus } from 'ink';
import { useProgram } from '../hooks';
import { Prompt, PromptProps } from './internal/Prompt';
import { Style } from './Style';
import msg from '../translate';
import { Selected } from './internal/Selected';

export interface ConfirmProps extends Omit<PromptProps<boolean>, 'validate'> {
  invalidError?: string;
  no?: string;
  yes?: string;
}

export function Confirm({ invalidError, onSubmit, no = 'N', yes = 'y', ...props }: ConfirmProps) {
  const { exit } = useProgram();
  const [value, setValue] = useState<boolean | null>(null);
  const { isFocused } = useFocus({ autoFocus: true });

  // Cant mock or spy in tests
  // istanbul ignore next
  useEffect(() => {
    if (no.length !== 1) {
      exit(new Error(`Prop "no" must be a single character.`));
    } else if (yes.length !== 1) {
      exit(new Error(`Prop "yes" must be a single character.`));
    }
  }, [no, yes, exit]);

  const handleInput = useCallback(
    (input: string) => {
      if (input === no) {
        setValue(false);
        onSubmit(false);
      } else if (input === yes) {
        setValue(true);
        onSubmit(true);
      } else {
        setValue(null);

        throw new Error(invalidError || msg('prompt:confirmInvalidValue', { no, yes }));
      }

      // Trigger submit
      return true;
    },
    [invalidError, no, onSubmit, yes],
  );

  return (
    <Prompt<boolean>
      {...props}
      afterLabel={
        value === null ? <Style type="muted">{`(${yes}/${no})`}</Style> : <Selected value={value} />
      }
      focused={isFocused}
      value={value}
      onInput={handleInput}
    />
  );
}
