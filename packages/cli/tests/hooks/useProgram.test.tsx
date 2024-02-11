import { useEffect } from 'react';
import { Box } from 'ink';
import { render } from 'ink-testing-library';
import { describe, expect, it } from 'vitest';
import { useProgram } from '../../src/hooks/useProgram';

describe('Input', () => {
	function TestProgram() {
		const program = useProgram();

		useEffect(() => {}, [program.exit]);

		return <Box />;
	}

	it('custom `exit` doesnt cause an infinite loop', () => {
		const { lastFrame } = render(<TestProgram />);

		expect(lastFrame()).toMatchSnapshot();
	});
});
