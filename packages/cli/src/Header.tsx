import React from 'react';
import { Box } from 'ink';
import Style from './Style';
import { StyleType } from './types';

export interface HeaderProps {
  label: string;
  type?: StyleType;
}

export default function Header({ label, type = 'default' }: HeaderProps) {
  return (
    <Box paddingTop={1} paddingBottom={1}>
      <Style bold inverted type={type}>
        {`  ${label.toLocaleUpperCase()}  `}
      </Style>
    </Box>
  );
}
