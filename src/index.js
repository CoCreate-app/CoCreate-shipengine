(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(["./client"], function(CoCreateShipengine) {
        	return factory(CoCreateShipengine)
        });
    } else if (typeof module === 'object' && module.exports) {
      const CoCreateShipengine = require("./server.js")
      module.exports = factory(CoCreateShipengine);
    } else {
        root.returnExports = factory(root["./client.js"]);
  }
}(typeof self !== 'undefined' ? self : this, function (CoCreateShipengine) {
  return CoCreateShipengine;
}));