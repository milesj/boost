import prettyMs from 'pretty-ms';

export default function formatTime(ms: number): string {
  if (!Number.isFinite(ms) || ms === 0) {
    return '0s';
  }

  return prettyMs(ms, { keepDecimalsOnWholeSeconds: true });
}
