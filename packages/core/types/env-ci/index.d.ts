declare module 'env-ci' {
  interface EnvCI { isCI: boolean }

  export default function envCI(): EnvCI;
}
