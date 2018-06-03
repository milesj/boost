module.exports = function random(max = 10, min = 3) {
  return Math.floor(Math.random() * max) + min;
};
