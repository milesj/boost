import React from 'react';
import { Box, Text } from 'ink';
import { SPACING_ROW } from '../constants';
import { ProgramOptions } from '../types';
import { Style } from './Style';

export interface IndexHelpProps extends ProgramOptions {
  children?: React.ReactNode;
}

export function IndexHelp({
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
      {!!banner && (
        <Box>
          <Text>{banner}</Text>
        </Box>
      )}

      <Box marginTop={SPACING_ROW}>
        <Text>
          {`${name} v${version}`} <Style type="muted">{bin}</Style>
        </Text>
      </Box>

      {!!header && (
        <Box marginTop={SPACING_ROW}>
          <Text>{header}</Text>
        </Box>
      )}

      {children}

      {!!footer && (
        <Box marginTop={SPACING_ROW}>
          <Text>{footer}</Text>
        </Box>
      )}
    </Box>
  );
}
