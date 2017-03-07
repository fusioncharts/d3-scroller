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
  },
  toPrecision: function(obj, value) {
      var tenPow = Math.pow(10, value);
      return Math.round(obj * tenPow) / tenPow;
  }
};

export default utils;
