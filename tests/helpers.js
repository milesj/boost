export function random(min, max) {
  return Math.floor(Math.random() * max) + min;
}

export function delayForParallel(name, value) {
  return new Promise((resolve, reject) => {
    if (name === 'qux') {
      reject(new Error('Failure'));
      return;
    }

    const start = Date.now();

    setTimeout(() => {
      resolve({
        key: `${value}-${name}`,
        end: Date.now(),
        start,
      });
    }, random(0, 150));
  });
}
