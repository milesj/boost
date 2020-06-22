/**
 * @copyright   2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import {
  Box,
  Color,
  Text,
  Static,
  useInput,
  useStdin,
  useStdout,
  StdinProps,
  StdoutProps,
} from 'ink';
import Command from './Command';
import Failure from './Failure';
import Header from './Header';
import Help from './Help';
import IndexHelp from './IndexHelp';
import Program from './Program';
import ProgramContext from './ProgramContext';
import Style from './Style';
import CLIError, { CLIErrorCode } from './CLIError';

export * from './constants';
export * from './decorators';
export * from './helpers';
export * from './types';

// Ink
export { Box, Color, Text, Static, useInput, useStdin, useStdout, StdinProps, StdoutProps };

// Boost
export {
  Command,
  Failure,
  Header,
  Help,
  IndexHelp,
  Program,
  ProgramContext,
  Style,
  CLIError,
  CLIErrorCode,
};
