import React from 'react';
import { Box } from 'ink';
import Style from './Style';
import { ProgramOptions } from './types';

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
    <Box flexDirection="column">
      {banner && <Box marginBottom={1}>{banner}</Box>}

      <Box marginBottom={1}>
        {`${name} v${version}`} <Style type="muted">{bin}</Style>
      </Box>

      {header && <Box marginBottom={1}>{header}</Box>}

      {children}

      {footer && <Box marginTop={1}>{footer}</Box>}
    </Box>
  );
}
