var utils = {
  mergeRecursive: function mergeRecursive(source, sink) {
     var prop;

     for (prop in sink) {

         if (source[prop] instanceof Object) {
             mergeRecursive(source[prop], sink[prop]);
         }
         else {
             source[prop] = sink[prop];
         }
     }
  },
  isObject: function (obj) {
    return typeof obj === 'object';
  },
  clone: function () {
    return this.parentNode.appendChild(this.cloneNode(true));
  }
};

export default utils;
