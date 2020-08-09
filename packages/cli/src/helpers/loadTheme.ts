import { requireModule } from '@boost/common';
import { env } from '@boost/internal';
import { style } from '@boost/terminal';
import { ThemePalette } from '../types';
import CLIError from '../CLIError';

const loadedThemes = new Map<string, ThemePalette>();

export default function loadTheme(): ThemePalette {
  const theme = env('CLI_THEME') ?? '';
  let palette = loadedThemes.get(theme);

  if (style.level > 0 && !palette && !!theme) {
    try {
      palette = requireModule(`@boost/theme-${theme}`);
    } catch {
      try {
        palette = requireModule(`boost-theme-${theme}`);
      } catch {
        throw new CLIError('THEME_UNKNOWN', [theme]);
      }
    }

    if (palette) {
      loadedThemes.set(theme, palette);
    }
  }

  // ANSI escapes + hexcodes dont work too well with snapshots
  const isTest = process.env.NODE_ENV === 'test';

  return {
    default: 'white',
    failure: 'red',
    // Use a hexcode since it sometimes renders as gray
    inverted: isTest ? 'black' : '#000',
    muted: 'gray',
    success: 'green',
    warning: 'yellow',
    ...palette,
  };
}
