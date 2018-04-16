const rl = require('readline');

console.log('one');
console.log('two');
console.log('three');
console.log('four');
console.log('five');

// Remove last line
// rl.moveCursor(process.stdout, 0, -1);
// rl.clearLine(process.stdout, -1);

// Replace specific line
rl.moveCursor(process.stdout, 0, -3);
rl.clearLine(process.stdout, 0);
console.log('THREE');
// rl.moveCursor(process.stdout, 0, 3);
rl.cursorTo(process.stdout, 0, process.stdout.rows - 3);
