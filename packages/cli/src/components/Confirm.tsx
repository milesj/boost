/* eslint-disable no-console */

import React, { useCallback, useEffect, useState } from 'react';
import { useFocus } from 'ink';
import msg from '../translate';
import { Prompt, PromptProps } from './internal/Prompt';
import { Selected } from './internal/Selected';
import { Style } from './Style';

export interface ConfirmProps extends Omit<PromptProps<boolean>, 'validate'> {
	invalidError?: string;
	no?: string;
	yes?: string;
}

export function Confirm({ invalidError, onSubmit, no = 'N', yes = 'y', ...props }: ConfirmProps) {
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

				throw new Error(invalidError || msg('prompt:confirmInvalidValue', { no, yes }));
			}

			// Trigger submit
			return true;
		},
		[invalidError, no, onSubmit, yes],
	);

	return (
		<Prompt<boolean>
			{...props}
			afterLabel={
				value === null ? <Style type="muted">{`(${yes}/${no})`}</Style> : <Selected value={value} />
			}
			focused={isFocused}
			value={value}
			onInput={handleInput}
		/>
	);
}
