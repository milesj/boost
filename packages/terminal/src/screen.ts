import ansiEscapes from 'ansi-escapes';
import termSize from 'term-size';

export default {
	clear: ansiEscapes.clearScreen,
	clearTerminal: ansiEscapes.clearTerminal,
	erase: ansiEscapes.eraseScreen,
	eraseDown: ansiEscapes.eraseDown,
	eraseEndLine: ansiEscapes.eraseEndLine,
	eraseLine: ansiEscapes.eraseLine,
	eraseLines: ansiEscapes.eraseLines,
	eraseStartLine: ansiEscapes.eraseStartLine,
	eraseUp: ansiEscapes.eraseUp,
	scrollDown: ansiEscapes.scrollDown,
	scrollUp: ansiEscapes.scrollUp,
	size: termSize,
};
