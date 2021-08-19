export function createFileName(
	name: string,
	ext: string,
	options: { envSuffix?: string; leadingDot?: boolean },
): string {
	const { envSuffix, leadingDot } = options;

	let fileName = name;

	if (leadingDot) {
		fileName = `.${name}`;
	}

	if (envSuffix) {
		fileName += `.${envSuffix}`;
	}

	fileName += `.${ext}`;

	return fileName;
}
