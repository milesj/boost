/* eslint-disable prefer-template */

const termSize = require('term-size');
const ansiEscapes = require('ansi-escapes');

// Terminal is 1-index based but ansi-escapes is 0-index

// Remove 1 for input line
const rows = termSize().rows - 1;

// Display all
for (let i = 1; i <= rows; i += 1) {
  process.stdout.write(String(i) + '\n');
}

// Replace even
for (let i = 2; i <= rows; i += 2) {
  process.stdout.write(ansiEscapes.cursorTo(0, i - 1) + ansiEscapes.eraseLine + i + ' REPLACED\n');
}

// Remove all
process.stdout.write(ansiEscapes.eraseLines(termSize().rows));

// Reset cursor back to the bottom
// process.stdout.write(ansiEscapes.cursorTo(0, termSize().rows));
