import formatType from './formatType';
import { CommandConfig } from '../types';

export default function formatCommandCall(name: string, metadata: CommandConfig): string {
  let output = name;

  if (metadata.params) {
    metadata.params.forEach((param) => {
      output += ' ';
      output += formatType(param, true);
    });
  }

  return output;
}
