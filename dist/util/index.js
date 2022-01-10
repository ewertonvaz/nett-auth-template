"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hex_to_ascii = void 0;
function hex_to_ascii(str1) {
    var hex = str1.toString();
    var str = '';
    for (var n = 0; n < hex.length; n += 2) {
        str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
    }
    return str;
}
exports.hex_to_ascii = hex_to_ascii;
