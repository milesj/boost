import ansiEscapes from 'ansi-escapes';

export default {
  backward: ansiEscapes.cursorBackward,
  down: ansiEscapes.cursorDown,
  forward: ansiEscapes.cursorForward,
  getPosition: ansiEscapes.cursorGetPosition,
  hide: ansiEscapes.cursorHide,
  left: ansiEscapes.cursorLeft,
  move: ansiEscapes.cursorMove,
  moveAbsolute: ansiEscapes.cursorTo,
  nextLine: ansiEscapes.cursorNextLine,
  prevLine: ansiEscapes.cursorPrevLine,
  restorePosition: ansiEscapes.cursorRestorePosition,
  savePosition: ansiEscapes.cursorSavePosition,
  show: ansiEscapes.cursorShow,
  up: ansiEscapes.cursorUp,
};
