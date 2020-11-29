import React, { useCallback, useState } from 'react';
import { useFocus } from 'ink';
import { Cursor } from './internal/Cursor';
import { Prompt, PromptProps } from './internal/Prompt';
import { Style } from './Style';

export interface InputProps extends PromptProps<string> {
  defaultValue?: string;
  mask?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function Input({
  defaultValue = '',
  mask,
  onChange,
  onSubmit,
  placeholder,
  ...props
}: InputProps) {
  const [value, setValue] = useState(defaultValue);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isDirty, setDirty] = useState(false);
  const { isFocused } = useFocus({ autoFocus: true });

  const handleReturn = useCallback(() => {
    onSubmit(value.trim());

    // Trigger submit
    return true;
  }, [onSubmit, value]);

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

  // Navigation
  const handleKeyUp = useCallback(() => {
    setCursorPosition(0);
  }, []);

  const handleKeyDown = useCallback(() => {
    setCursorPosition(value.length);
  }, [value]);

  const handleKeyLeft = useCallback(() => {
    setCursorPosition((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleKeyRight = useCallback(() => {
    setCursorPosition((prev) => Math.min(prev + 1, value.length));
  }, [value]);

  return (
    <Prompt<string>
      {...props}
      afterLabel={
        value === '' && !isDirty && placeholder ? (
          <Style type="muted">{placeholder}</Style>
        ) : (
          <Cursor
            focused={isFocused}
            position={cursorPosition}
            value={mask ? mask.repeat(value.length) : value}
          />
        )
      }
      focused={isFocused}
      value={value}
      onBackspace={handleBackspace}
      onDelete={handleBackspace}
      onInput={handleInput}
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
      onKeyLeft={handleKeyLeft}
      onKeyRight={handleKeyRight}
      onReturn={handleReturn}
    />
  );
}
