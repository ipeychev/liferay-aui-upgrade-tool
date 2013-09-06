(function() {
    'use strict';

    var YUITest = require('yuitest');

    var path = require('path');

    var fs = require('fs');

    var replaceAUIDialog = (new (require(path.resolve(__dirname, '../lib/replace-aui-dialog.js')).ReplaceAUIDialog)());

    var testDataJS = fs.readFileSync(path.resolve(__dirname, '../data/data-replace-aui-dialog.js'), 'utf8');

    var contentJS = replaceAUIDialog.process(testDataJS);

    var testDataJSP = fs.readFileSync(path.resolve(__dirname, '../data/data-replace-aui-dialog.jsp'), 'utf8');

    var contentJSP = replaceAUIDialog.process(testDataJSP);

    YUITest.TestRunner.add(new YUITest.TestCase({
        name: "Test Convert A.Dialog",

        'test convert A.Dialog to Liferay.Util.Window.getWindow': function() {
            var dest,
                src;

            src =
                'new A.Dialog(\n' +
                '    {\n' +
                '        centered: true,\n' +
                '        cssClass: \'mail-dialog\',\n' +
                '        destroyOnClose: true,\n' +
                '        modal: true,\n' +
                '        title: Liferay.Language.get(\'add-account\'),\n' +
                '        width: 600\n' +
                '    }\n' +
                ');';


            dest =
                'Liferay.Util.Window.getWindow(\n' +
                '{\n' +
                'dialog: {\n' +
                '        centered: true,\n' +
                '        cssClass: \'mail-dialog\',\n' +
                '        destroyOnClose: true,\n' +
                '        modal: true,\n' +
                '        title: Liferay.Language.get(\'add-account\'),\n' +
                '        width: 600\n' +
                '    }}\n' +
                ').plug(';


            YUITest.Assert.isTrue(contentJS.indexOf(dest) !== -1, src + ' should be transformed');
        },

        'test convert A.Dialog to Liferay.Util.Window.getWindow multiple times': function() {
            var dest,
                src;

            src =
                'addAccount: function() {\n' +
                '    var instance = this;\n' +
                '    var test = new A.Dialog(\n' +
                '        {\n' +
                '            centered: true,\n' +
                '            cssClass: \'mail-dialog\',\n' +
                '            destroyOnClose: true,\n' +
                '            modal: true,\n' +
                '            title: Liferay.Language.get(\'add-account\'),\n' +
                '            width: 600\n' +
                '        }\n' +
                '    );';


            dest =
                'addAccount: function() {\n' +
                '    var instance = this;\n' +
                '    var test = Liferay.Util.Window.getWindow(\n' +
                '{\n' +
                'dialog: {\n' +
                '            centered: true,\n' +
                '            cssClass: \'mail-dialog\',\n' +
                '            destroyOnClose: true,\n' +
                '            modal: true,\n' +
                '            title: Liferay.Language.get(\'add-account\'),\n' +
                '            width: 600\n' +
                '        }}\n' +
                '    );';


            YUITest.Assert.isTrue(contentJS.indexOf(dest) !== -1, src + ' should be transformed');
        },

        /*
         * @tests #25
         */
        'test convert A.Dialog to Liferay.Util.Window.getWindow multiple times in JSP': function() {
            var dest,
                src;

            console.log(contentJSP);

            src =
                'var dialog = new A.Dialog({' +
                '        title: \'\x3Cspring:message1 code=\"cssStyle.help.text.title\" \x2F\x3E\',' +
                '        centered: true,' +
                '        draggable: true,' +
                '        modal: true,' +
                '        height: 400,' +
                '        width: 650,' +
                '}).plug(A.Plugin.IO, {uri: \'\x2Fcarousel-portlet\x2Fhtml\x2Fcarousel\x2FcssStyleHelp.jsp\'}).render();' +
                '    dialog.show();' +
                '});';


            dest =
                'addAccount: function() {\n' +
                '    var instance = this;\n' +
                '    var test = Liferay.Util.Window.getWindow(\n' +
                '{\n' +
                'dialog: {\n' +
                '            centered: true,\n' +
                '            cssClass: \'mail-dialog\',\n' +
                '            destroyOnClose: true,\n' +
                '            modal: true,\n' +
                '            title: Liferay.Language.get(\'add-account\'),\n' +
                '            width: 600\n' +
                '        }}\n' +
                '    );';


            YUITest.Assert.isTrue(contentJS.indexOf(dest) !== -1, src + ' should be transformed');
        },
    }));
}());