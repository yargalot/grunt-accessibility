var HTMLCS_RUNNER = new function() {
    this.run = function(standard) {
        var self = this;

        // At the moment, it passes the whole DOM document.
        HTMLCS.process(standard, document, function() {
            var messages = HTMLCS.getMessages();
            var length   = messages.length;
            var documentString = document.documentElement.outerHTML;


            var charIndexToLocation = function(html, index) {
              var substr = html.substr(0, index),
              lastLineBreak = substr.lastIndexOf('\n') || '',
              lineNumber = (substr.match(/\n/g)||[]).length + 1,
              columnNumber = index - lastLineBreak;

              return {
                linenumber: lineNumber,
                columnNumber: columnNumber
              };
            };

            console.log(documentString);

            for (var i = 0; i < length; i++) {

                var htmlString = messages[i].element.outerHTML;
                var elementIndex = documentString.indexOf(htmlString);
                var position = charIndexToLocation(documentString, elementIndex);

                // Print out actual element to string
                messages[i].elementString = htmlString;
                messages[i].lineNumber    = position.lineNumber;
                messages[i].columnNumber  = position.columnNumber;

                // Output to messages
                self.output(messages[i]);
            }

            console.log('done');
        });
    };

    this.output = function(msg) {
        // Simple output for now.

        var typeName = 'UNKNOWN';
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
          msg.element.id + '|' +
          msg.lineNumber + '|' +
          msg.columnNumber

        );

    };

};
