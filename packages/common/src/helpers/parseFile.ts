import fs from 'fs';
import CommonError from '../CommonError';
import Path from '../Path';
import { parse as parseJSON } from '../serializers/json';
import { parse as parseYAML } from '../serializers/yaml';
import { PortablePath } from '../types';
import requireModule from './requireModule';

export default function parseFile<T>(filePath: PortablePath): T {
  const path = Path.create(filePath);

  if (!path.isAbsolute()) {
    throw new CommonError('PATH_REQUIRE_ABSOLUTE');
  }

  switch (path.ext()) {
    case '.js':
    case '.jsx':
      return requireModule(path);

    case '.json':
    case '.json5':
      return parseJSON(fs.readFileSync(path.path(), 'utf8'));

    case '.yml':
    case '.yaml':
      return parseYAML(fs.readFileSync(path.path(), 'utf8'));

    default:
      throw new CommonError('PARSE_INVALID_EXT', [path.name()]);
  }
}
