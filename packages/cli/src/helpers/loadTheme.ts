import { createRequire } from 'node:module';
import { env } from '@boost/internal';
import { style } from '@boost/terminal';
import { CLIError } from '../CLIError';
import { ThemePalette } from '../types';

const loadedThemes = new Map<string, ThemePalette>();
const requireTheme = createRequire(import.meta.url);

export function loadTheme(): ThemePalette {
	const theme = env('CLI_THEME') ?? '';
	let palette = loadedThemes.get(theme);

	if (style.level > 0 && !palette && !!theme) {
		try {
			palette = requireTheme(`@boost/theme-${theme}`) as ThemePalette;
		} catch {
			try {
				palette = requireTheme(`boost-theme-${theme}`) as ThemePalette;
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
		info: 'cyan',
		// Use a hexcode since it sometimes renders as gray
		inverted: isTest ? 'black' : '#000',
		muted: 'gray',
		notice: 'magenta',
		success: 'green',
		warning: 'yellow',
		...palette,
	};
}
