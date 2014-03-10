
var HTMLCS_Section508_Sniffs_I = {
    /**
     * Determines the elements to register for processing.
     *
     * Each element of the returned array can either be an element name, or "_top"
     * which is the top element of the tested code.
     *
     * @returns {Array} The list of elements.
     */
    register: function()
    {
        return [
            'frame',
            'iframe',
            'object'
        ];

    },

    /**
     * Process the registered element.
     *
     * @param {DOMNode} element The element registered.
     * @param {DOMNode} top     The top element of the tested code.
     */
    process: function(element, top)
    {
        var nodeName   = element.nodeName.toLowerCase();
        var hasTitle   = element.hasAttribute('title');
        var titleEmpty = true;

        if (hasTitle === true) {
            titleEmpty = HTMLCS.util.isStringEmpty(element.getAttribute('title'));
        }

        if (titleEmpty === true) {
            HTMLCS.addMessage(HTMLCS.ERROR, top, 'This ' + nodeName + ' element is missing title text. Frames should be titled with text that facilitates frame identification and navigation.', 'Frames');
        }
    }
};
