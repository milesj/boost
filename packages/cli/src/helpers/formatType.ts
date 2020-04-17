import { style } from '@boost/terminal';

export default function formatType(
  config: {
    label?: string;
    multiple?: boolean;
    required?: boolean;
    type: string;
  },
  inline: boolean = false,
): string {
  let type = config.type + (config.multiple ? '[]' : '');

  if (inline) {
    if (config.label) {
      type = config.label;
    }

    type = config.required ? `<${type}>` : `[${type}]`;
  }

  return style.gray(type);
}
