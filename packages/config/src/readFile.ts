import fs from 'fs';
import { Path } from '@boost/common';

export default function readFile(path: Path): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(path.path(), 'utf8', (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}
