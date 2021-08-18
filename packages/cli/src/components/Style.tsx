import React from 'react';
import { Text, TextProps } from 'ink';
import { loadTheme } from '../helpers/loadTheme';
import { StyleType, Writeable } from '../types';

export interface StyleProps extends Pick<TextProps, 'bold' | 'italic' | 'underline' | 'wrap'> {
	children: NonNullable<React.ReactNode>;
	/** Invert the colors to style the background instead of foreground. Defaults
  to `false`. */
	inverted?: boolean;
	/** Theme palette name to style with. Defaults to "none". */
	type?: StyleType | 'none';
}

/**
 * A React component that styles text and backgrounds based on the current Boost theme.
 */
export function Style(props: StyleProps) {
	const { children, inverted = false, type = 'none', ...restProps } = props;
	const theme = loadTheme();
	const nextProps: Writeable<TextProps> = {};

	if (type !== 'none') {
		if (inverted) {
			nextProps.backgroundColor = theme[type];
			nextProps.color = theme.inverted;
		} else {
			nextProps.color = theme[type];
		}
	}

	return (
		<Text {...restProps} {...nextProps}>
			{children}
		</Text>
	);
}
