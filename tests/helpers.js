export function random(min, max) {
  return Math.floor(Math.random() * max) + min;
}

export function delayForParallel(name, value) {
  return new Promise((resolve, reject) => {
    if (name === 'qux') {
      reject(new Error('Failure'));
      return;
    }

    resolve(value);
  });
}
