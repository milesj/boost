/**
 * @copyright   2017-2019, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

import debug from 'debug';

export default function enableDebug(namespace: string) {
  const { DEBUG } = process.env;
  const flag = `${namespace}:*`;

  if (DEBUG) {
    if (DEBUG.includes(flag)) {
      return;
    }

    process.env.DEBUG += `,${flag}`;
  } else {
    process.env.DEBUG = flag;
  }

  debug.enabled(flag);
}
