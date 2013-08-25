(function() {
    'use strict';

    var YUITest = require('yuitest');

    var path = require('path');

    var fs = require('fs');

    var changeHandlerOnClick = (new (require(path.resolve(__dirname, '../lib/change-handler-to-on-click.js')).ChangeHandlerOnClick)());

    var testDataJS = fs.readFileSync(path.resolve(__dirname, '../data/data-change-handler-to-on-click.js'), 'utf8');

    var contentJS = changeHandlerOnClick.process(testDataJS);
    
    YUITest.TestRunner.add(new YUITest.TestCase({
        name: "Test Rename Handler to onClick in Toolbar",

        'test rename handler to onClick': function() {
            console.log(contentJS);

            var src1 =
                '        label: \'button1\',\n' +
                '        handler: function(event1) {\n' +
                '            someFunction1();\n' +
                '        }\n' +
                '    }';


            var dest1 =
                '        label: \'button1\',\n' +
                '        on: {\n' +
                '            click: function(event1) {\n' +
                '                someFunction1();\n' +
                '            }\n' +
                '        }';
                
                
            YUITest.Assert.isTrue(contentJS.indexOf(dest1 !== -1), src1 + ' should be transformed');
        }
    }));
}());