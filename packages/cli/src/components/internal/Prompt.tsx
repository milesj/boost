import React, { useCallback, useEffect, useState } from 'react';
import { Box, useInput, Key } from 'ink';
import { figures } from '@boost/terminal';
import { Label } from './Label';
import { Style } from '../Style';

export type KeyInput = Key;

export interface PromptProps<T> {
  label: string | React.ReactElement;
  prefix?: string;
  onSubmit?: (value: T) => void;
  validate?: (value: T) => void;
}

export interface InternalPromptProps<T> extends PromptProps<T> {
  afterLabel?: React.ReactElement;
  beforeLabel?: React.ReactElement;
  children?: React.ReactNode;
  focused?: boolean;
  onBackspace?: (key: KeyInput) => void;
  onDelete?: (key: KeyInput) => void;
  onEscape?: (key: KeyInput) => void;
  onInput?: (value: string, key: KeyInput) => void;
  onKeyDown?: (key: KeyInput) => void;
  onKeyLeft?: (key: KeyInput) => void;
  onKeyRight?: (key: KeyInput) => void;
  onKeyUp?: (key: KeyInput) => void;
  onPageDown?: (key: KeyInput) => void;
  onPageUp?: (key: KeyInput) => void;
  onReturn?: () => void;
  onTab?: (key: KeyInput) => void;
  submitAfterInput?: boolean;
  submitAfterReturn?: boolean;
  validateInput?: (value: string) => void;
  value: T | null;
}

export function Prompt<T>({
  afterLabel,
  beforeLabel,
  children,
  focused,
  label,
  onBackspace,
  onDelete,
  onEscape,
  onInput,
  onKeyDown,
  onKeyLeft,
  onKeyRight,
  onKeyUp,
  onPageDown,
  onPageUp,
  onReturn,
  onTab,
  prefix = '?',
  submitAfterInput,
  submitAfterReturn,
  validate,
  validateInput,
  value,
}: InternalPromptProps<T>) {
  const [error, setError] = useState<Error | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback(
    (value: T) => {
      try {
        validate?.(value);
        onReturn?.();
        setError(null);
        setSubmitted(true);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error);
          setSubmitted(false);
        }
      }
    },
    [validate, onReturn],
  );

  // When the input value changes from the parent,
  // trigger a submission and handle the result
  useEffect(() => {
    if (submitAfterInput && !error && value !== null) {
      handleSubmit(value);
    }
  }, [value, error, submitAfterInput, handleSubmit]);

  // Provide event handler based props for all scenarios
  useInput(
    // eslint-disable-next-line complexity
    (input, key) => {
      if (key.upArrow) {
        onKeyUp?.(key);
      } else if (key.downArrow) {
        onKeyDown?.(key);
      } else if (key.leftArrow) {
        onKeyLeft?.(key);
      } else if (key.rightArrow) {
        onKeyRight?.(key);
      } else if (key.pageUp) {
        onPageUp?.(key);
      } else if (key.pageDown) {
        onPageDown?.(key);
      } else if (key.return) {
        if (submitAfterReturn) {
          handleSubmit(value as T);
        } else {
          onReturn?.();
        }
      } else if (key.tab) {
        onTab?.(key);
      } else if (key.backspace) {
        onBackspace?.(key);
        setSubmitted(false);
      } else if (key.delete) {
        onDelete?.(key);
        setSubmitted(false);
      } else if (key.escape) {
        onEscape?.(key);
      } else {
        try {
          validateInput?.(input);
          onInput?.(input, key);
          setError(null);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error);
          }
        } finally {
          setSubmitted(false);
        }
      }
    },
    { isActive: focused },
  );

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        <Box>
          {submitted && !error && <Style type="success">{figures.tick}</Style>}
          {!submitted && error && <Style type="failure">{figures.cross}</Style>}
          {!submitted && !error && <Style type="info">{prefix}</Style>}
        </Box>

        {beforeLabel}

        <Box marginLeft={1} marginRight={1}>
          <Label>{label}</Label>
        </Box>

        {afterLabel}
      </Box>

      {error && (
        <Box marginLeft={2}>
          <Style type="failure">{error.message}</Style>
        </Box>
      )}

      {children && (
        <Box flexDirection="column" marginLeft={2}>
          {children}
        </Box>
      )}
    </Box>
  );
}
