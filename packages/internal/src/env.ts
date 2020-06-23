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

  return process.env[name] as T;
}
