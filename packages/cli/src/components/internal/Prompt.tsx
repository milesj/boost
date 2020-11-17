import React, { useState } from 'react';
import { Box, useInput, Key } from 'ink';
import { figures } from '@boost/terminal';
import { Label } from './Label';
import Style from '../Style';

export type KeyInput = Key;

export interface PromptProps<T> {
  defaultValue?: T;
  label: NonNullable<React.ReactNode>;
  focused?: boolean;
  prefix?: string;
  validate?: (value: T) => void;
}

export interface InternalPromptProps<T> extends PromptProps<T> {
  afterLabel?: React.ReactElement;
  beforeLabel?: React.ReactElement;
  children?: React.ReactNode;
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
  onReturn?: (key: KeyInput) => void;
  onTab?: (key: KeyInput) => void;
  value: T;
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
  validate,
  value,
}: InternalPromptProps<T>) {
  const [error, setError] = useState<Error | null>(null);
  const [submitted, setSubmitted] = useState(false);

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
        try {
          validate?.(value);
          onReturn?.(key);
          setError(null);
          setSubmitted(true);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error);
            setSubmitted(false);
          }
        }
      } else if (key.tab) {
        onTab?.(key);
      } else if (key.backspace) {
        onBackspace?.(key);
      } else if (key.delete) {
        onDelete?.(key);
      } else if (key.escape) {
        onEscape?.(key);
      } else {
        onInput?.(input, key);
        setSubmitted(false);
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
