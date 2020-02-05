import { CommandMetadata } from '../types';
import formatType from './formatType';

export default function formatCommandCall(name: string, metadata: CommandMetadata): string {
  let output = name;

  if (metadata.params) {
    metadata.params.forEach(param => {
      output += ' ';
      output += formatType(param, true);
    });
  }

  return output;
}
