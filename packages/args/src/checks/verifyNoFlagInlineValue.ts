export default function verifyNoFlagInlineValue(inlineValue?: string) {
  if (inlineValue !== undefined) {
    throw new Error('Flags and flag groups may not use inline values.');
  }
}
