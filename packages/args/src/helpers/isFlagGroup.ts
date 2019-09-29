import { FLAG_GROUP_FORMAT } from '../constants';

export default function isFlagGroup(arg: string): boolean {
  return FLAG_GROUP_FORMAT.test(arg);
}
