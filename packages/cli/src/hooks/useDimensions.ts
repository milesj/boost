import { useEffect, useState } from 'react';
import { useStdout } from 'ink';
import { screen } from '@boost/terminal';

export function useDimensions(): { height: number; width: number } {
	const [dims, setDims] = useState(() => screen.size());
	const { stdout } = useStdout();

	useEffect(() => {
		// istanbul ignore next
		const handler = () => {
			setDims(screen.size());
		};

		stdout?.on('resize', handler);

		return () => {
			stdout?.off('resize', handler);
		};
	}, [stdout]);

	return {
		height: dims.rows,
		width: dims.columns,
	};
}
