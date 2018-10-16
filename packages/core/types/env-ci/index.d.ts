declare module 'env-ci' {
  interface EnvCI { isCi: boolean }

  export default function envCI(): EnvCI;
}
