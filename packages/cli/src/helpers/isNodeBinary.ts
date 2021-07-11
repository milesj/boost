export default function isNodeBinary(bin: string): boolean {
	return Boolean(bin.match(/(\/|\\)node(js)?(\.exe)?$/u));
}
