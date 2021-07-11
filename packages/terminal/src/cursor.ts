import ansiEscapes from 'ansi-escapes';

export default {
	backward: ansiEscapes.cursorBackward,
	down: ansiEscapes.cursorDown,
	forward: ansiEscapes.cursorForward,
	hide: ansiEscapes.cursorHide,
	nextLine: ansiEscapes.cursorNextLine,
	position: ansiEscapes.cursorGetPosition,
	prevLine: ansiEscapes.cursorPrevLine,
	restorePosition: ansiEscapes.cursorRestorePosition,
	savePosition: ansiEscapes.cursorSavePosition,
	show: ansiEscapes.cursorShow,
	startLine: ansiEscapes.cursorLeft,
	to: ansiEscapes.cursorMove,
	toAbsolute: ansiEscapes.cursorTo,
	up: ansiEscapes.cursorUp,
};
