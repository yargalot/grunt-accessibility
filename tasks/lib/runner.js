var HTMLCS_RUNNER = new function() {
    this.run = function(standard) {
        var self = this;

        // At the moment, it passes the whole DOM document.
        HTMLCS.process(standard, document, function() {
            var messages = HTMLCS.getMessages();
            var length   = messages.length;

            // var charIndexToLocation = function(html, index) {
            //   var substr = html.substr(0, index),
            //   lastLineBreak = substr.lastIndexOf('\n') || '',
            //   lineNumber = (substr.match(/\n/g)||[]).length + 2, //HTML inner html hack
            //   columnNumber = index - lastLineBreak;
            //
            //   return {
            //     lineNumber: lineNumber,
            //     columnNumber: columnNumber
            //   };
            // };

            for (var i = 0; i < length; i++) {

                var htmlString = messages[i].element.outerHTML;
                // var elementIndex = html.indexOf(htmlString);
                // var position = charIndexToLocation(html, elementIndex);

                // Print out actual element to string
                messages[i].elementString = htmlString;
                // messages[i].lineNumber    = position.lineNumber;
                // messages[i].columnNumber  = position.columnNumber;

                // Output to messages
                self.output(messages[i]);
            }

            console.log('done');
        });
    };

    this.output = function(msg) {
        // Simple output for now.
        var typeName = 'UNKNOWN';

        console.log(msg);

        switch (msg.type) {
            case HTMLCS.ERROR:
                typeName = 'ERROR';
            break;

            case HTMLCS.WARNING:
                typeName = 'WARNING';
            break;

            case HTMLCS.NOTICE:
                typeName = 'NOTICE';
            break;
        }

        console.log(
          typeName + '|' +
          msg.code + '|' +
          msg.msg + '|' +
          msg.elementString + '|' +
          msg.element.className + '|' +
          msg.element.id
        );

    };

};
