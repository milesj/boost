const rl = require('readline');

console.log('one');
console.log('two');
console.log('three');
console.log('four');
console.log('five');

// Remove last line
// rl.moveCursor(process.stdout, 0, -1);
// rl.clearLine(process.stdout, -1);

// console.log('\x1B[1A'.repeat(3));
// console.log('\x1B[J');
// console.log('\x1B[1A'.repeat(2));
// console.log('FOUR');
// console.log('FIVE');

rl.cursorTo(process.stdout, 0, process.stdout.rows);
process.stdout.write('\x1B[1A\x1B[K');
process.stdout.write('\x1B[1A\x1B[K');
console.log('FOUR');
console.log('FIVE');

// // Replace specific line
// rl.moveCursor(process.stdout, 0, -1);
// rl.clearLine(process.stdout, 0);
// rl.moveCursor(process.stdout, 0, -1);
// rl.clearLine(process.stdout, 0);
// rl.moveCursor(process.stdout, 0, -1);
// rl.clearLine(process.stdout, 0);
// // rl.moveCursor(process.stdout, 0, 3);
// rl.cursorTo(process.stdout, 0, process.stdout.rows);
