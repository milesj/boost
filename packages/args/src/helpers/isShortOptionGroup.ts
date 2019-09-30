import { SHORT_OPTION_GROUP_FORMAT } from '../constants';

export default function isShortOptionGroup(arg: string): boolean {
  return SHORT_OPTION_GROUP_FORMAT.test(arg);
}
