import { LONG_OPTION_FORMAT } from '../constants';

export default function isLongOption(arg: string): boolean {
  return LONG_OPTION_FORMAT.test(arg);
}
