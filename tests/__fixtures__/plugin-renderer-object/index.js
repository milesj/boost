// Sync
module.exports = function rendererPlugin(options) {
	return {
		options,
		render() {
			return 'test';
		},
	};
};
