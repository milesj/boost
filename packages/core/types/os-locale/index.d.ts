declare module 'os-locale' {
  interface OSLocale {
    (): Promise<string>;
    sync(): string;
  }

  const osl: OSLocale;

  export default osl;
}
