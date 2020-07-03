import { requireModule } from '@boost/common';
import { env } from '@boost/internal';
import { style } from '@boost/terminal';
import { ThemePalette } from '../types';
import CLIError from '../CLIError';

const loadedThemes = new Map<string, ThemePalette>();

export default function loadTheme(): ThemePalette {
  const theme = env('CLI_THEME') ?? '';
  let palette = loadedThemes.get(theme);

  console.log({ hasPalette: !palette, level: style.level, theme });

  if (style.level >= 2 && !palette && !!theme) {
    try {
      palette = requireModule(`@boost/theme-${theme}`);
    } catch {
      try {
        palette = requireModule(`boost-theme-${theme}`);
      } catch {
        throw new CLIError('THEME_UNKNOWN', [theme, theme]);
      }
    }

    if (palette) {
      loadedThemes.set(theme, palette);
    }
  }

  return {
    default: 'white',
    failure: 'red',
    inverted: 'black',
    muted: 'gray',
    success: 'green',
    warning: 'yellow',
    ...palette,
  };
}
