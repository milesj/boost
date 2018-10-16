declare module 'env-ci' {
  interface EnvCI { isCI: boolean }

  const envCI: EnvCI;
  export default envCI;
}
