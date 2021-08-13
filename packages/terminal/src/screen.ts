import ansiEscapes from 'ansi-escapes';
import termSize from 'term-size';

/** Clear the terminal screen. */
export const clear = ansiEscapes.clearScreen;

/** Clear the whole terminal, including scrollback buffer. */
export const { clearTerminal } = ansiEscapes;

/** Erase the screen and move the cursor the top left position. */
export const erase = ansiEscapes.eraseScreen;

/** Erase the screen from the current line down to the bottom of the screen. */
export const { eraseDown } = ansiEscapes;

/** Erase from the current cursor position to the end of the current line. */
export const { eraseEndLine } = ansiEscapes;

/** Erase the entire current line. */
export const { eraseLine } = ansiEscapes;

/** Erase from the current cursor position up the specified amount of rows. */
export const { eraseLines } = ansiEscapes;

/** Erase from the current cursor position to the start of the current line. */
export const { eraseStartLine } = ansiEscapes;

/** Erase the screen from the current line up to the top of the screen. */
export const { eraseUp } = ansiEscapes;

/** Scroll down the screen by 1 line. */
export const { scrollDown } = ansiEscapes;

/** Scroll up the screen by 1 line. */
export const { scrollUp } = ansiEscapes;

/** Reliably and accurately get the screen size (in `columns` and `rows`). */
export const size = termSize;
