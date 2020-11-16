import React, { useEffect, useRef, useState } from 'react';
import { Text } from 'ink';
import { Cursor } from './internal/Cursor';
import { CommonPromptProps, KeyInput, Prompt } from './internal/Prompt';
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
  const [cursorPosition, setCursorPosition] = useState(0);
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) {
      onChange?.(value);
    } else {
      mounted.current = true;
    }
  }, [onChange, value]);

  // Remove characters
  const handleBackspace = (key: KeyInput) => {
    if (!cursorPosition || !value) {
      return;
    }

    if (key.shift) {
      setCursorPosition(0);
      setValue('');

      return;
    }

    setValue(value.slice(0, cursorPosition - 1) + value.slice(cursorPosition));
    setCursorPosition(cursorPosition - 1);
  };

  // Add characters
  const handleInput = (input: string) => {
    setValue(value.slice(0, cursorPosition) + input + value.slice(cursorPosition));
    setCursorPosition(cursorPosition + input.length);
  };

  // Submit text
  const handleReturn = () => {
    onSubmit?.(value);
  };

  return (
    <Prompt
      {...props}
      afterLabel={
        value === '' && placeholder ? (
          <Style type="muted">{placeholder}</Style>
        ) : (
          <Text>
            {value.slice(0, cursorPosition)}
            {!hideCursor && focused && <Cursor />}
            {value.slice(cursorPosition)}
          </Text>
        )
      }
      focused={focused}
      value={value}
      onBackspace={handleBackspace}
      onDelete={handleBackspace}
      onInput={handleInput}
      onKeyUp={() => {
        setCursorPosition(0);
      }}
      onKeyDown={() => {
        setCursorPosition(value.length);
      }}
      onKeyLeft={() => {
        setCursorPosition((prev) => Math.max(prev - 1, 0));
      }}
      onKeyRight={() => {
        setCursorPosition((prev) => Math.min(prev + 1, value.length));
      }}
      onReturn={handleReturn}
    />
  );
}
