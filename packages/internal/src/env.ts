let envVars: { [key: string]: unknown } = {};

if (typeof global.process !== 'undefined') {
  envVars = process.env;
} else if (typeof global.window !== 'undefined') {
  // @ts-expect-error
  envVars = window;
}

export default function env<T extends string = string>(
  key: string,
  value?: T | null,
): T | undefined {
  const name = `BOOSTJS_${key}`;

  if (value === null) {
    delete envVars[name];

    return undefined;
  }

  if (typeof value === 'string') {
    envVars[name] = value;

    return value;
  }

  return envVars[name] as T;
}
