export default function verifyCommandOrder(
  command: string,
  foundCommand: string,
  positionalsLength: number,
) {
  if (foundCommand !== '') {
    throw new Error(
      `Command has been defined as "${foundCommand}", received another "${command}".`,
    );
  }

  if (positionalsLength !== 0) {
    throw new Error('Command must be passed as the first non-option, non-positional argument.');
  }
}
