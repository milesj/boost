import { Box, useFocus } from 'ink';
import React, { useCallback, useEffect, useState } from 'react';
import { useProgram } from '../hooks';
import { Prompt, PromptProps } from './internal/Prompt';
import { Style } from './Style';

export interface ConfirmProps extends PromptProps<boolean> {
  no?: string;
  yes?: string;
}

export function Confirm({ onSubmit, no = 'N', yes = 'y', ...props }: ConfirmProps) {
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

  const validate = useCallback(
    (input: string) => {
      if (input !== no && input !== yes) {
        setValue(null);

        throw new Error(`Please select "${yes}" or "${no}"`);
      }
    },
    [no, yes],
  );

  const handleInput = useCallback(
    (input: string) => {
      if (input === no) {
        setValue(false);
        onSubmit(false);
      } else if (input === yes) {
        setValue(true);
        onSubmit(true);
      }

      // Trigger submit
      return true;
    },
    [no, onSubmit, yes],
  );

  return (
    <Prompt<boolean>
      {...props}
      afterLabel={
        <>
          <Style type="muted">{`(${yes}/${no})`}</Style>
          <Box width={2} />
          {value !== null && <Style type="notice">{String(value)}</Style>}
        </>
      }
      focused={isFocused}
      validateInput={validate}
      value={value}
      onInput={handleInput}
    />
  );
}
