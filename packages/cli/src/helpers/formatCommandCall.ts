import formatType from './formatType';
import { CommandMetadata } from '../types';

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
