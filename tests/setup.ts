global.delay = function delay(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};
