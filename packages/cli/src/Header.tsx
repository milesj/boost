import React from 'react';
import { Box } from 'ink';
import Style from './Style';
import { StyleType } from './types';

export interface HeaderProps {
  label: string;
  leading?: boolean;
  trailing?: boolean;
  type?: StyleType;
}

export default function Header({ label, leading, trailing, type = 'default' }: HeaderProps) {
  return (
    <Box paddingTop={leading ? 0 : 1} paddingBottom={trailing ? 0 : 1}>
      <Style inverted type={type}>
        {` ${label.toLocaleUpperCase()} `}
      </Style>
    </Box>
  );
}
