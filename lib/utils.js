module.exports = {
  isArray: function isArray(obj) {
    if (typeof obj === 'undefined') { return false; }
    return Object.prototype.toString.call(obj).indexOf("[object Array]") === 0;
  }
};

