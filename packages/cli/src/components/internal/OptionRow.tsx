/* eslint-disable no-nested-ternary */

import React from 'react';
import { Box } from 'ink';
import { figures } from '@boost/terminal';
import { Style } from '../Style';

export interface OptionRowProps {
  highlighted?: boolean;
  label: string;
  selected?: boolean;
}

export function OptionRow({ highlighted, label, selected }: OptionRowProps) {
  return (
    <Box flexDirection="row">
      <Box flexGrow={0} marginRight={1}>
        <Style type={highlighted ? 'info' : selected ? 'notice' : 'muted'}>
          {highlighted || selected ? figures.pointer : figures.pointerSmall}
        </Style>
      </Box>

      <Box>
        <Style type={highlighted ? 'info' : selected ? 'notice' : 'none'}>{label}</Style>
      </Box>
    </Box>
  );
}
