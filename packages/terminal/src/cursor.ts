import ansiEscapes from 'ansi-escapes';

/** Number of columns to move backward. Defaults to `1`. */
export const backward = ansiEscapes.cursorBackward;

/** Number of rows to move down. Defaults to `1`. */
export const down = ansiEscapes.cursorDown;

/** Number of columns to move forward. Defaults to `1`. */
export const forward = ansiEscapes.cursorForward;

/** Hide the cursor. */
export const hide = ansiEscapes.cursorHide;

/** Move cursor to the next line. */
export const nextLine = ansiEscapes.cursorNextLine;

/** Return the current cursur position. */
export const position = ansiEscapes.cursorGetPosition;

/** Move cursor to the previous line. */
export const prevLine = ansiEscapes.cursorPrevLine;

/** Restores the cursor position/state. */
export const restorePosition = ansiEscapes.cursorRestorePosition;

/** Saves the cursor position/state. */
export const savePosition = ansiEscapes.cursorSavePosition;

/** Show the cursor. */
export const show = ansiEscapes.cursorShow;

/** Move cursor to the start of the current line. */
export const startLine = ansiEscapes.cursorLeft;

/** Set the relative position of the cursor. */
export const to = ansiEscapes.cursorMove;

/** Set the absolute position of the cursor, starting from the top left. */
export const toAbsolute = ansiEscapes.cursorTo;

/** Number of rows to move up. Defaults to `1`. */
export const up = ansiEscapes.cursorUp;
