import React, { useEffect, useRef, useState } from 'react';
import { Cursor } from './internal/Cursor';
import { Prompt, PromptProps } from './internal/Prompt';
import Style from './Style';

export interface InputProps extends PromptProps<string> {
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
}

export function Input({
  defaultValue = '',
  focused,
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
  const handleBackspace = () => {
    if (!cursorPosition || !value) {
      return;
    }

    setCursorPosition(cursorPosition - 1);
    setValue(
      cursorPosition >= value.length
        ? value.slice(0, -1)
        : value.slice(0, cursorPosition - 1) + value.slice(cursorPosition),
    );
  };

  // Add characters
  const handleInput = (input: string) => {
    setCursorPosition(cursorPosition + input.length);
    setValue(
      cursorPosition >= value.length
        ? value + input
        : value.slice(0, cursorPosition) + input + value.slice(cursorPosition),
    );
  };

  return (
    <Prompt<string>
      {...props}
      afterLabel={
        value === '' && !focused && placeholder ? (
          <Style type="muted">{placeholder}</Style>
        ) : (
          <Cursor focused={focused} position={cursorPosition} value={value} />
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
      onReturn={() => {
        onSubmit?.(value);
      }}
    />
  );
}
