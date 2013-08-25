(function() {
	'use strict';

	var handlerRegex = /((?:(?:\.push[\s\r\n]*\()|=[\s\r\n]*\[)[\s\r\n]*{[\s\S]*?handler[\s\r\n]*:)/g;

	function ChangeHandlerOnClick(config) {
		this._config = config;
	}

	ChangeHandlerOnClick.prototype = {
		constructor: ChangeHandlerOnClick,

		process: function(content, context) {
			return content.replace(handlerRegex, function(match, g1, offset) {

				return g1;
			});
		}
	};

	module.exports.ChangeHandlerOnClick = ChangeHandlerOnClick;
}());