import React from 'react';
import { Box, Color } from 'ink';

export interface HeaderProps {
  label: string;
}

export default function Header({ label }: HeaderProps) {
  return (
    <Box paddingTop={1} paddingBottom={2}>
      <Color bgWhite black bold>
        {`  ${label.toLocaleUpperCase()}  `}
      </Color>
    </Box>
  );
}
