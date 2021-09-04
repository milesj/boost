/* eslint-disable @typescript-eslint/method-signature-style */

declare namespace jest {
	interface Matchers<R, T = {}> {
		toBeFilePath(path: string): R;
	}
}

declare const __DEV__: boolean;

declare function delay(time?: number): Promise<void>;
