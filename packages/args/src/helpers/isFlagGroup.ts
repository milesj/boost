const FLAG_GROUP = /^-[a-z]{2,}$/iu;

export default function isFlagGroup(arg: string): boolean {
  return FLAG_GROUP.test(arg);
}
