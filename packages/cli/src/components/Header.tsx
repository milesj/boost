import React from 'react';
import { Box } from 'ink';
import Style from './Style';
import { StyleType } from '../types';
import { SPACING_ROW } from '../constants';

export interface HeaderProps {
  label: string;
  marginTop?: number;
  marginBottom?: number;
  type?: StyleType | 'none';
}

export default function Header({
  label,
  marginTop = SPACING_ROW,
  marginBottom = SPACING_ROW,
  type = 'default',
}: HeaderProps) {
  return (
    <Box marginTop={marginTop} marginBottom={marginBottom}>
      <Style bold inverted type={type}>
        {` ${label.toLocaleUpperCase()} `}
      </Style>
    </Box>
  );
}
