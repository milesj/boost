const resolver = require('enhanced-resolve').create.sync({
	conditionNames: ['import', 'module', 'require', 'node', 'default'],
	extensions: ['.ts', '.tsx', '.mjs', '.js', '.json', '.node'],
});

module.exports = function (request, options) {
	if (request.startsWith('@boost')) {
		return resolver(options.basedir, request);
	}

	return options.defaultResolver(request, options);
};
