export default function env<T extends string = string>(
  key: string,
  value?: T | null,
): T | undefined {
  const name = `BOOSTJS_${key}`;

  if (value === null) {
    delete process.env[name];

    return undefined;
  }

  if (typeof value === 'string') {
    process.env[name] = value;

    return value;
  }

  // TODO: Remove fallback in v2
  return (process.env[name] || process.env[`BOOST_${key}`]) as T;
}
