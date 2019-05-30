import prettyMs, { Options } from 'pretty-ms';

export default function formatMs(ms: number, options?: Options): string {
  if (!Number.isFinite(ms) || ms === 0) {
    return '0s';
  }

  return prettyMs(ms, { keepDecimalsOnWholeSeconds: true, ...options });
}
