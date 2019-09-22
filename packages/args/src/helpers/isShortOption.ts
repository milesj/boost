const SHORT_OPTION = /^-[a-z]{1}$/iu;

export default function isShortOption(arg: string): boolean {
  return SHORT_OPTION.test(arg);
}
