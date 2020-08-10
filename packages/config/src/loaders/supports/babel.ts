// eslint-disable-next-line import/no-mutable-exports
let supportsBabel: boolean;

try {
  // eslint-disable-next-line
  require('@babel/core');

  supportsBabel = true;
} catch {
  supportsBabel = false;
}

export default supportsBabel;
