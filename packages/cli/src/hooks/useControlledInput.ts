import { useInput } from 'ink';

export interface ControlledInputOptions {
  focused?: boolean;
  onBackspace?: () => void;
  onDelete?: () => void;
  onEscape?: () => void;
  onInput?: (value: string) => void;
  onKeyDown?: () => void;
  onKeyLeft?: () => void;
  onKeyRight?: () => void;
  onKeyUp?: () => void;
  onPageDown?: () => void;
  onPageUp?: () => void;
  onReturn?: () => void;
  onTab?: () => void;
}

export default function useControlledInput({
  focused,
  onBackspace,
  onDelete,
  onEscape,
  onInput,
  onKeyDown,
  onKeyLeft,
  onKeyRight,
  onKeyUp,
  onPageDown,
  onPageUp,
  onReturn,
  onTab,
}: ControlledInputOptions) {
  useInput(
    // eslint-disable-next-line complexity
    (input, key) => {
      if (key.escape || (key.ctrl && input === 'c')) {
        onEscape?.();

        return;
      }

      if (key.upArrow) {
        onKeyUp?.();
      } else if (key.downArrow) {
        onKeyDown?.();
      } else if (key.leftArrow) {
        onKeyLeft?.();
      } else if (key.rightArrow) {
        onKeyRight?.();
      } else if (key.pageUp) {
        onPageUp?.();
      } else if (key.pageDown) {
        onPageDown?.();
      } else if (key.return) {
        onReturn?.();
      } else if (key.tab) {
        onTab?.();
      } else if (key.backspace) {
        onBackspace?.();
      } else if (key.delete) {
        onDelete?.();
      } else {
        onInput?.(input);
      }
    },
    { isActive: focused },
  );
}
