import React from 'react';
import { Box } from 'ink';
import Style from './Style';
import { ProgramOptions } from './types';
import { SPACING_ROW } from './constants';

export interface IndexHelpProps extends ProgramOptions {
  children?: React.ReactNode;
}

export default function IndexHelp({
  banner,
  bin,
  children,
  footer,
  header,
  name,
  version,
}: IndexHelpProps) {
  return (
    <Box marginBottom={1} flexDirection="column">
      {banner && <Box>{banner}</Box>}

      <Box marginTop={SPACING_ROW}>
        {`${name} v${version}`} <Style type="muted">{bin}</Style>
      </Box>

      {header && <Box marginTop={SPACING_ROW}>{header}</Box>}

      {children}

      {footer && <Box marginTop={SPACING_ROW}>{footer}</Box>}
    </Box>
  );
}
