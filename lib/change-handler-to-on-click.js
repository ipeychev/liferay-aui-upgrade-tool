(function() {
    'use strict';

    var handlerRegex = /((?:(?:\.push[\s\r\n]*\()|=[\s\r\n]*\[)[\s\r\n]*{[\s\S]*?)handler[\s\r\n]*:/;

    function ChangeHandlerOnClick(config) {
        this._config = config;
    }

    ChangeHandlerOnClick.prototype = {
        constructor: ChangeHandlerOnClick,

        process: function(content, context) {
            ////////////////////////////////////////////////////////////////////

            function getHandlerWhitespaceIndex(string) {
                var index = string.length;

                var htWhitespace = {
                    ' ': 1,
                    '\t': 1,
                    '\n': 1,
                    '\r': 1
                };

                while(htWhitespace[string.charAt(--index)]);

                return index;
            }

            ////////////////////////////////////////////////////////////////////

            var res;

            var match = handlerRegex.exec(subject);
           
            debugger;

            if (match != null) {
                var matchedText = match[0];
                var g1 = match[1];
                var offset = match.index;
                        
                var character,
                    found,
                    handlerWhitespaceIndex,
                    htClosedParentheses,
                    htOpenParentheses,
                    i,
                    lastParenthese,
                    restPart,
                    stack,
                    targetString;
                
                htClosedParentheses = {
                    '}': '{'
                };

                htOpenParentheses = {
                    '{': 1
                };

                targetString = content.substring(offset);

                for (i = 0; i < targetString.length; i++) {
                    character = targetString.charAt(i);

                    if (htOpenParentheses[character]) {
                        stack.push(character);
                    }
                    else if (htClosedParentheses[character]) {
                        if (stack.length === 0) {
                            found = true;
                            break;
                        }
                    }
                }

                if (found) {
                    handlerWhitespaceIndex = getHandlerWhitespaceIndex(g1);

                    restPart = content.substring(0, offset);

                    res += 'on: {';

                    res += g1.substring(handlerWhitespaceIndex);

                    res += 'click: ';

                    res += content.substr(offset, i);

                    res += '}';

                    content = res;

                    content += this.process(content, context);
                }

                return content;
            });
        }
    };

    module.exports.ChangeHandlerOnClick = ChangeHandlerOnClick;
}());