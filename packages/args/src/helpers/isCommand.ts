/**
 * Check that an argument is a command by looping through a list of available
 * commands. If an exact match, or looks like a sub-command ("cmd:sub"),
 * return true.
 */
export default function isCommand(arg: string, commands: string[]): boolean {
  if (commands.length === 0) {
    return false;
  }

  return commands.some(command => arg === command || arg.startsWith(`${command}:`));
}
