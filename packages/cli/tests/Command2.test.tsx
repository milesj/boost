import React, { useContext } from 'react';
import { Box, Text } from 'ink';
import Command from '../src/Command2';

class BoostCommand extends Command {
  static description = 'Description';

  static path = 'boost';

  static allowUnknownOptions = true;

  static allowVariadicParams = true;

  run() {
    return Promise.resolve();
  }
}

test('x', () => {
  expect(true).toEqual(true);
});
