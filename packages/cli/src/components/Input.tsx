import React, { useEffect, useRef, useState } from 'react';
import { Box, Text } from 'ink';
import { Label } from './Label';
import Style from './Style';
import useControlledInput from '../hooks/useControlledInput';

export interface InputProps {
  defaultValue?: string;
  focused?: boolean;
  label: NonNullable<React.ReactNode>;
  onChange?: (value: string) => void;
  onSubmit?: (value: string) => void;
  placeholder?: string;
  validate?: (value: string) => void;
}

export function Input({
  defaultValue = '',
  focused,
  label,
  onChange,
  onSubmit,
  placeholder,
  validate,
}: InputProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState('');
  const mounted = useRef(false);

  const handleBackspace = () => {
    if (value) {
      setValue(value.slice(0, -1));
    }
  };

  useEffect(() => {
    if (mounted.current) {
      onChange?.(value);
    } else {
      mounted.current = true;
    }
  }, [onChange, value]);

  useControlledInput({
    focused,
    onBackspace: handleBackspace,
    onDelete: handleBackspace,
    onInput(input) {
      setValue((prev) => prev + input);
    },
    onReturn() {
      if (validate) {
        try {
          validate(value);
          setError('');
        } catch (error) {
          setError(error.message);
        }
      }

      if (!error) {
        onSubmit?.(value);
      }
    },
  });

  return (
    <Box flexDirection="column">
      <Box flexDirection="row">
        <Box marginRight={1}>
          <Style type="warning">?</Style>
        </Box>

        <Box marginRight={1}>
          <Label>{label}</Label>
        </Box>

        {value === '' && placeholder ? (
          <Style type="muted">{placeholder}</Style>
        ) : (
          <Text>{value}</Text>
        )}
      </Box>

      {error !== '' && (
        <Box marginLeft={2}>
          <Style type="failure">{error}</Style>
        </Box>
      )}
    </Box>
  );
}
