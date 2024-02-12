let envVars: Record<string, unknown> = {};

if (global.process !== undefined) {
	envVars = process.env;
} else if ('window' in global && global.window !== undefined) {
	// @ts-expect-error Allow type mismatch
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	envVars = window;
}

export function env<T extends string = string>(key: string, value?: T | null): T | undefined {
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
