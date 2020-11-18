import { useFocus } from 'ink';
import React, { useState } from 'react';
import { Cursor } from './internal/Cursor';
import { Prompt, PromptProps } from './internal/Prompt';
import { Style } from './Style';

export interface InputProps extends PromptProps<string> {
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function Input({
  defaultValue = '',
  onChange,
  onSubmit,
  placeholder,
  ...props
}: InputProps) {
  const [value, setValue] = useState(defaultValue);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isDirty, setDirty] = useState(false);
  const { isFocused } = useFocus({ autoFocus: true });

  // Remove characters
  const handleBackspace = () => {
    if (!cursorPosition || !value) {
      return;
    }

    const nextValue =
      cursorPosition >= value.length
        ? value.slice(0, -1)
        : value.slice(0, cursorPosition - 1) + value.slice(cursorPosition);

    setCursorPosition(cursorPosition - 1);
    setValue(nextValue);
    onChange?.(nextValue);
  };

  // Add characters
  const handleInput = (input: string) => {
    const nextValue =
      cursorPosition >= value.length
        ? value + input
        : value.slice(0, cursorPosition) + input + value.slice(cursorPosition);

    setCursorPosition(cursorPosition + input.length);
    setValue(nextValue);
    setDirty(true);
    onChange?.(nextValue);
  };

  return (
    <Prompt<string>
      {...props}
      submitAfterReturn
      afterLabel={
        value === '' && !isDirty && placeholder ? (
          <Style type="muted">{placeholder}</Style>
        ) : (
          <Cursor focused={isFocused} position={cursorPosition} value={value} />
        )
      }
      focused={isFocused}
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
      onReturn={() => {
        onSubmit?.(value.trim());
      }}
    />
  );
}
