/**
 * @copyright   2016-2017, Miles Johnson
 * @license     https://opensource.org/licenses/MIT
 */

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
}
