global.delay = function delay(time: number = 100) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
};

// Differs between osx/windows
jest.mock('figures', () => ({
  ...jest.requireActual('figures'),
  tick: '^',
  cross: 'x',
  pointer: '>>',
  pointerSmall: '>',
  circleDotted: 'o',
  bullet: '●',
}));

// Focus is required for snapshots
jest.mock('ink', () => ({
  ...jest.requireActual('ink'),
  useFocus: () => ({ isFocused: true }),
  useFocusManager: () => ({ focusNext() {} }),
}));
