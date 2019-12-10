export default function env<T extends string = string>(key: string, value?: T): T | undefined {
  if (typeof value === 'string') {
    process.env[`BOOSTJS_${key}`] = value;

    return value;
  }

  // TODO: Remove fallback in v2
  return (process.env[`BOOSTJS_${key}`] || process.env[`BOOST_${key}`]) as T;
}
