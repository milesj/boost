import { useCallback, useEffect, useReducer, useRef } from 'react';

// eslint-disable-next-line no-magic-numbers
const DEFAULT_FPS = 1000 / 30;

export function useRenderLoop(fps: number = DEFAULT_FPS): () => void {
	const [, forceUpdate] = useReducer((count) => count + 1, 0);
	const timer = useRef<NodeJS.Timeout>();

	const clear = useCallback(() => {
		if (timer.current) {
			clearInterval(timer.current);
		}
	}, []);

	useEffect(() => {
		timer.current = setInterval(forceUpdate, fps);

		return clear;
	}, [clear, fps]);

	return clear;
}
