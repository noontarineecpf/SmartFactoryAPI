// constants.js

// 'use strict';

let constants = {
    SLASH_DMY: "DD/MM/YYYY",
    SLASH_DMYHMS: "DD/MM/YYYY HH:mm:ss",
    SLASH_YMD: "YYYY/MM/DD",
    SLASH_YMDHMS: "YYYY/MM/DD HH:mm:ss",
    DASH_DMY: "DD-MM-YYYY",
    DASH_DMYHMS: "DD-MM-YYYY HH:mm:ss",
    DASH_YMD: "YYYY-MM-DD",
    DASH_YMDHMS: "YYYY-MM-DD HH:mm:ss"
};

module.exports = Object.freeze(constants); // freeze prevents changes by users