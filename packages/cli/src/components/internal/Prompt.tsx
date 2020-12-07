import React, { useCallback, useState } from 'react';
import { Box, useInput, Key, useFocusManager } from 'ink';
import { figures } from '@boost/terminal';
import { Label } from './Label';
import { Style } from '../Style';
import { useIsMounted } from '../../hooks/useIsMounted';

export type KeyInput = Key;

export interface PromptProps<T> {
  label: NonNullable<React.ReactNode>;
  prefix?: string;
  onSubmit: (value: T) => void;
  validate?: (value: T) => void;
}

export interface InternalPromptProps<T> extends Omit<PromptProps<T>, 'onSubmit'> {
  afterLabel?: React.ReactNode;
  beforeLabel?: React.ReactNode;
  children?: React.ReactNode;
  focused?: boolean;
  onBackspace?: (key: KeyInput) => void;
  onDelete?: (key: KeyInput) => void;
  onEscape?: (key: KeyInput) => void;
  onInput?: (value: string, key: KeyInput) => boolean | void;
  onKeyDown?: (key: KeyInput) => void;
  onKeyLeft?: (key: KeyInput) => void;
  onKeyRight?: (key: KeyInput) => void;
  onKeyUp?: (key: KeyInput) => void;
  onPageDown?: (key: KeyInput) => void;
  onPageUp?: (key: KeyInput) => void;
  onReturn?: () => boolean | void;
  onSpace?: (key: KeyInput) => void;
  onTab?: (key: KeyInput) => void;
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
  onSpace,
  onTab,
  prefix = '?',
  validate,
  value,
}: InternalPromptProps<T>) {
  const { focusNext } = useFocusManager();
  const [error, setError] = useState<Error | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const mounted = useIsMounted();

  const attemptSubmit = useCallback(
    (cb: () => boolean | void) => {
      if (!mounted.current) {
        return;
      }

      try {
        const doSubmit = !!cb();

        setSubmitted(doSubmit);
        setError(null);

        if (doSubmit) {
          focusNext();
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          setSubmitted(false);
          setError(error);
        }
      }
    },
    [focusNext, mounted],
  );

  useInput(
    // eslint-disable-next-line complexity
    (input, key) => {
      if (!mounted.current) {
        return;
      }

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
        // Only run if we want validation or to submit,
        // otherwise we trigger an unwanted submitted state
        if (onReturn || validate) {
          attemptSubmit(() => {
            if (value !== null) {
              validate?.(value);
            }

            return onReturn?.();
          });
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
      } else if (input === ' ' && onSpace) {
        onSpace(key);
        setSubmitted(false);
      } else {
        attemptSubmit(() => onInput?.(input, key));
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

      {children && focused && (
        <Box flexDirection="column" marginLeft={2}>
          {children}
        </Box>
      )}
    </Box>
  );
}
