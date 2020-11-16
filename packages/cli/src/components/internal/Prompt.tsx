import React, { useState } from 'react';
import { Box, useInput } from 'ink';
import { figures } from '@boost/terminal';
import { Label } from './Label';
import Style from '../Style';

export interface PromptProps<T> {
  afterLabel?: React.ReactNode;
  beforeLabel?: React.ReactNode;
  children?: React.ReactNode;
  focused?: boolean;
  label: NonNullable<React.ReactNode>;
  onBackspace?: () => void;
  onDelete?: () => void;
  onEscape?: () => void;
  onInput?: (value: string) => void;
  onKeyDown?: () => void;
  onKeyLeft?: () => void;
  onKeyRight?: () => void;
  onKeyUp?: () => void;
  onPageDown?: () => void;
  onPageUp?: () => void;
  onReturn?: () => void;
  onTab?: () => void;
  prefix?: string;
  validate?: (value: T) => void;
  value: T;
}

export interface CommonPromptProps<T>
  extends Pick<PromptProps<T>, 'focused' | 'label' | 'validate'> {
  defaultValue?: T;
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
}: PromptProps<T>) {
  const [error, setError] = useState<Error | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useInput(
    // eslint-disable-next-line complexity
    (input, key) => {
      if (key.escape || (key.ctrl && input === 'c')) {
        onEscape?.();

        return;
      }

      if (key.upArrow) {
        onKeyUp?.();
      } else if (key.downArrow) {
        onKeyDown?.();
      } else if (key.leftArrow) {
        onKeyLeft?.();
      } else if (key.rightArrow) {
        onKeyRight?.();
      } else if (key.pageUp) {
        onPageUp?.();
      } else if (key.pageDown) {
        onPageDown?.();
      } else if (key.return && !key.shift) {
        try {
          if (validate) {
            validate(value);
          }

          onReturn?.();
          setError(null);
          setSubmitted(true);
        } catch (error: unknown) {
          if (error instanceof Error) {
            setError(error);
            setSubmitted(false);
          }
        }
      } else if (key.tab) {
        onTab?.();
      } else if (key.backspace) {
        onBackspace?.();
      } else if (key.delete) {
        onDelete?.();
      } else {
        onInput?.(input);
        setSubmitted(false);
      }
    },
    { isActive: focused },
  );

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        <Box marginRight={1}>
          {submitted && !error && <Style type="success">{figures.tick}</Style>}
          {!submitted && error && <Style type="failure">{figures.cross}</Style>}
          {!submitted && !error && <Style type="info">{prefix}</Style>}
        </Box>

        {beforeLabel}

        <Box marginRight={1}>
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
