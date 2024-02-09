export default {
	plugins: [
		{
			name: 'virtual-modules',
			resolveId(id) {
				if (id.startsWith('cjs-') || id.startsWIth('esm-')) {
					return `virtual:${id}`;
				}
			},
		},
	],
};
