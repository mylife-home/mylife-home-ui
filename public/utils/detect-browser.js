'use strict';

const userAgent = window.navigator.userAgent;
const isAndroid = /android/i.test(userAgent);
const isIOS = /iPad|iPhone|iPod/.test(userAgent);

console.log(`isAndoid: ${isAndroid}, isIOS: ${isIOS}`);

export default { isMobile: isAndroid || isIOS };