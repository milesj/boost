const COMMAND_FORMAT = /^\w+$/iu;

export default function verifyCommandFormat(command: string) {
  if (!COMMAND_FORMAT.test(command)) {
    throw new Error(
      `Invalid "${command}" command format. Must be letters, numbers, and underscores.`,
    );
  }
}
