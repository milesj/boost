let supportsBabel: boolean;

try {
  require('@babel/core');
  require('@babel/preset-env');
  require('@babel/preset-typescript');

  supportsBabel = true;
} catch {
  supportsBabel = false;
}

export default supportsBabel;
