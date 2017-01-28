"use strict";

var objectAssign = require('object-assign');

var CSS_STRING_VARS = {
    'base-css-name': 'react-container',
    'SCROLLBAR_COLOR': '#F1F1F1',
    'SCROLLBAR_BUTTON_COLOR': '#F1F1F1',
    'SCROLLBAR_BUTTON_HOVER_COLOR': '#A8A8A8',
    'SCROLLBAR_KNOB_COLOR': '#C1C1C1',
    'SCROLLBAR_KNOB_HOVER_COLOR': '#A8A8A8',
    'SCROLLBAR_KNOB_CAPTURED_COLOR': '#787878',
    'LAYOUT_SPLITTER_COLOR': 'gray',
};

var CSS_NUMBER_VARS = {
    'SCROLLBAR_KNOB_OFFSET': 1
};

var CSS_ALL_VARS = objectAssign(CSS_STRING_VARS, CSS_NUMBER_VARS);

module.exports = {
    CSS_NUMBER_VARS: CSS_NUMBER_VARS,
    CSS_STRING_VARS: CSS_STRING_VARS,
    CSS_ALL_VARS: CSS_ALL_VARS
};
