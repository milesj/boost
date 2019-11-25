import fs from 'fs';
import JSON5 from 'json5';
import YAML from 'js-yaml';
import { RuntimeError } from '@boost/internal';
import Path from '../Path';
import requireModule from './requireModule';
import { PortablePath } from '../types';

export default function parseFile<T>(filePath: PortablePath): T {
  const path = Path.create(filePath);

  if (!path.isAbsolute()) {
    throw new RuntimeError('common', 'CM_REQ_ABS_PATH');
  }

  switch (path.ext()) {
    case '.js':
    case '.jsx':
      return requireModule(path);

    case '.json':
    case '.json5':
      return JSON5.parse(fs.readFileSync(path.path(), 'utf8'));

    case '.yml':
    case '.yaml':
      return YAML.safeLoad(fs.readFileSync(path.path(), 'utf8'));

    default:
      throw new RuntimeError('common', 'CM_PARSE_INVALID_EXT', [path.name()]);
  }
}
