import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'ink';
import { Cursor } from './internal/Cursor';
import { CommonPromptProps, Prompt } from './internal/Prompt';
import Style from './Style';

export interface InputProps extends CommonPromptProps<string> {
  hideCursor?: boolean;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
}

export function Input({
  defaultValue = '',
  focused,
  hideCursor,
  onChange,
  onSubmit,
  placeholder,
  ...props
}: InputProps) {
  const [value, setValue] = useState(defaultValue);
  const mounted = useRef(false);

  // Remove characters
  const handleBackspace = () => {
    if (value) {
      setValue(value.slice(0, -1));
    }
  };

  // Add characters
  const handleInput = (input: string) => {
    setValue((prev) => prev + input);
  };

  // Submit text
  const handleReturn = () => {
    onSubmit?.(value);
  };

  useEffect(() => {
    if (mounted.current) {
      onChange?.(value);
    } else {
      mounted.current = true;
    }
  }, [onChange, value]);

  return (
    <Prompt
      {...props}
      afterLabel={
        value === '' && placeholder ? (
          <Style type="muted">{placeholder}</Style>
        ) : (
          <Text>
            {value}
            {!hideCursor && focused && <Cursor />}
          </Text>
        )
      }
      focused={focused}
      value={value}
      onBackspace={handleBackspace}
      onDelete={handleBackspace}
      onInput={handleInput}
      onReturn={handleReturn}
    />
  );
}
