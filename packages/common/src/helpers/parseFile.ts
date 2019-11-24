import fs from 'fs';
import path from 'path';
import JSON5 from 'json5';
import YAML from 'js-yaml';
import { RuntimeError } from '@boost/internal';
import Path from '../Path';
import requireModule from './requireModule';
import { FilePath } from '../types';

export default function parseFile<T>(filePath: Path | FilePath): T {
  let name = '';
  let ext = '';
  let absPath = '';

  if (filePath instanceof Path) {
    name = filePath.baseName();
    ext = filePath.ext();
    absPath = filePath.toString();
  } else {
    name = path.basename(filePath);
    ext = path.extname(filePath);
    absPath = path.normalize(filePath);
  }

  if (!path.isAbsolute(absPath)) {
    throw new RuntimeError('common', 'CM_REQ_ABS_PATH');
  }

  switch (ext) {
    case '.js':
    case '.jsx':
      return requireModule(absPath);

    case '.json':
    case '.json5':
      return JSON5.parse(fs.readFileSync(absPath, 'utf8'));

    case '.yml':
    case '.yaml':
      return YAML.safeLoad(fs.readFileSync(absPath, 'utf8'));

    default:
      throw new RuntimeError('common', 'CM_PARSE_INVALID_EXT', [name]);
  }
}
