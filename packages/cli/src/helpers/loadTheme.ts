// import { requireModule } from '@boost/common';
// import { env } from '@boost/internal';
// import { style } from '@boost/terminal';
import { ThemePalette } from '../types';

// const THEME = env('THEME') ?? '';
// const loadedThemes = new Map<string, ThemePalette>();

// TODO enable in v2
export default function loadTheme(): ThemePalette {
  // const palette = loadedThemes.get(THEME);

  // if (palette) {
  //   return palette;
  // }

  // if (style.level >= 2 && !!THEME) {
  //   try {
  //     palette = requireModule(`@boost/theme-${THEME}`);
  //   } catch {
  //     try {
  //       palette = requireModule(`boost-theme-${THEME}`);
  //     } catch {
  //       throw new Error(
  //         `Theme could not be loaded. Attempted \`@boost/theme-${THEME}\` and \`boost-theme-${THEME}\`.`,
  //       );
  //     }
  //   }

  //   loadedThemes.set(THEME, palette!);
  // }

  return {
    default: 'white',
    failure: 'red',
    inverted: 'black',
    muted: 'gray',
    success: 'green',
    warning: 'yellow',
  };
}
