/* eslint-disable no-magic-numbers */

import { useCallback, useEffect, useReducer, useRef } from 'react';

export function useRenderLoop(fps: number = 30): () => void {
	const [, forceUpdate] = useReducer((count: number) => count + 1, 0);
	const timer = useRef<NodeJS.Timeout>();

	const clear = useCallback(() => {
		if (timer.current) {
			clearInterval(timer.current);
		}
	}, []);

	useEffect(() => {
		timer.current = setInterval(forceUpdate, fps / 1000);

		return clear;
	}, [clear, fps]);

	return clear;
}
