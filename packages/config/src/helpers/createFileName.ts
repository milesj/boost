export default function createFileName(
  name: string,
  ext: string,
  { envSuffix, leadingDot }: { envSuffix?: string; leadingDot?: boolean },
): string {
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
