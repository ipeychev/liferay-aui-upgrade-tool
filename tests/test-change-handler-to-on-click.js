(function() {
	'use strict';

	var YUITest = require('yuitest');

	var path = require('path');

	var fs = require('fs');

	var renameCSSClasses = (new (require(path.resolve(__dirname, '../lib/change-handler-to-on-click.js')).RenameCSSClasses)());

	var testDataJS = fs.readFileSync(path.resolve(__dirname, '../data/data-change-handler-to-on-click.js'), 'utf8');

	var contentJS = renameCSSClasses.process(testDataJS);
	
	YUITest.TestRunner.add(new YUITest.TestCase({
		name: "Test Rename Handler to onClick in Toolbar",

		'test rename CSS classes from CSS': function() {
			YUITest.Assert.isTrue(contentCSS.indexOf('.test123 .close-panel {') !== -1, '.test123 .btn-cancel { should be transformed.');

			YUITest.Assert.isTrue(contentCSS.indexOf('.alert {') !== -1, '.portlet-msg-alert { should be transformed.');

			YUITest.Assert.isTrue(contentCSS.indexOf('.alert.alert-success .alert.alert-info {') !== -1, '.portlet-msg-success .portlet-msg-info { should be transformed.');
		},

		'test rename CSS classes from JSP': function() {
			YUITest.Assert.isTrue(contentJSP.indexOf('<span class="alert alert-error"><%= fi') !== -1, 'portlet-msg-error should be transformed.');

			YUITest.Assert.isTrue(contentJSP.indexOf('A.all(\'.alert.alert-success\').hide();') !== -1, 'portlet-msg-success should be transformed.');

			YUITest.Assert.isTrue(contentJSP.indexOf('<span class="alert alert-error"><liferay-ui:message') !== -1, '<span class="portlet-msg-error"><liferay-ui:message should be transformed.');

			YUITest.Assert.isTrue(contentJSP.indexOf('<div class="alert">') !== -1, '<div class="portlet-msg-alert"> should be transformed.');

			YUITest.Assert.isTrue(contentJSP.indexOf('<div class="hide alert alert-error" id="') !== -1, '<div class="hide portlet-msg-error" id=" should be transformed');

			YUITest.Assert.isTrue(contentJSP.indexOf('<div class="hide alert alert-success" id="') !== -1, '<div class="hide portlet-msg-success" id=" should be transformed');
		}
	}));
}());