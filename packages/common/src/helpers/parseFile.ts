import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';
import YAML from 'js-yaml';
import { Path } from '../types';
import requireModule from './requireModule';

export default function parseFile<T>(filePath: Path): T {
  const name = path.basename(filePath);
  const ext = path.extname(filePath);

  if (!path.isAbsolute(filePath)) {
    throw new Error('An absolute file path is required.');
  }

  switch (ext) {
    case '.js':
    case '.jsx':
    case '.mjs':
      return requireModule(filePath);

    case '.json':
    case '.json5':
      return JSON5.parse(fs.readFileSync(filePath, 'utf8'));

    case '.yml':
    case '.yaml':
      return YAML.safeLoad(fs.readFileSync(filePath, 'utf8'));

    default:
      throw new Error(`Unable to parse file "${name}". Unsupported file extension.`);
  }
}
