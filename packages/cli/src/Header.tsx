import React from 'react';
import { Box } from 'ink';
import Style from './Style';
import { StyleType } from './types';
import { SPACING_ROW } from './constants';

export interface HeaderProps {
  label: string;
  type?: StyleType;
}

export default function Header({ label, type = 'default' }: HeaderProps) {
  return (
    <Box marginTop={SPACING_ROW} marginBottom={SPACING_ROW}>
      <Style bold inverted type={type}>
        {` ${label.toLocaleUpperCase()} `}
      </Style>
    </Box>
  );
}
