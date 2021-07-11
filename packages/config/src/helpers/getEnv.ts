export default function getEnv(name: string): string {
	const constName = name.replace(/[A-Z]/gu, (char) => `_${char}`).toUpperCase();

	return (process.env[`${constName}_ENV`] || process.env.NODE_ENV || 'development').toLowerCase();
}
