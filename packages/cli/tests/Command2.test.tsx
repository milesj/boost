import React, { useContext } from 'react';
import { Box, Text } from 'ink';
import Command from '../src/Command2';

class BoostCommand extends Command {
  run() {
    return Promise.resolve();
  }
}

test('x', () => {
  expect(true).toEqual(true);
});
