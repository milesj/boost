import path from 'path';

export function getFixture(file: string): string {
  return path.join(__dirname, '__fixtures__', file);
}
