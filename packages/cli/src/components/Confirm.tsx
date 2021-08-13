/* eslint-disable no-console */

import React, { useCallback, useEffect, useState } from 'react';
import { useFocus } from 'ink';
import { msg } from '../translate';
import { Prompt, PromptProps } from './internal/Prompt';
import { Selected } from './internal/Selected';
import { Style } from './Style';

export interface ConfirmProps extends Omit<PromptProps<boolean>, 'validate'> {
	/** Error message to display when an invalid character is pressed. Defaults to a custom message. */
	invalidError?: string;
	/** Character that triggers a falsy state when pressed. Defaults to "N". */
	no?: string;
	/** Character that triggers a truthy state when pressed. Defaults to "y". */
	yes?: string;
}

/**
 * A React component that renders a yes/no confirmation prompt.
 */
export function Confirm(props: ConfirmProps) {
	const { invalidError, onSubmit, no = 'N', yes = 'y', ...restProps } = props;
	const [value, setValue] = useState<boolean | null>(null);
	const { isFocused } = useFocus({ autoFocus: true });

	useEffect(() => {
		if (no.length !== 1) {
			console.error(`Prop "no" must be a single character.`);
		} else if (yes.length !== 1) {
			console.error(`Prop "yes" must be a single character.`);
		}
	}, [no, yes]);

	const handleInput = useCallback(
		(input: string) => {
			if (input === no) {
				setValue(false);
				onSubmit(false);
			} else if (input === yes) {
				setValue(true);
				onSubmit(true);
			} else {
				setValue(null);

				throw new Error(invalidError ?? msg('prompt:confirmInvalidValue', { no, yes }));
			}

			// Trigger submit
			return true;
		},
		[invalidError, no, onSubmit, yes],
	);

	return (
		<Prompt<boolean>
			{...restProps}
			afterLabel={
				value === null ? <Style type="muted">{`(${yes}/${no})`}</Style> : <Selected value={value} />
			}
			focused={isFocused}
			value={value}
			onInput={handleInput}
		/>
	);
}
