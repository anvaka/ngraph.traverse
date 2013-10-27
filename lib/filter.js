module.exports = function(filter) {
  var filterType = typeof filter;
  if (filterType === 'function') {
    // this is already a predicate function, return it:
    return filter;
  }

  if (filter && filterType === 'object') {
    return function (target) {
      if (typeof target !== 'object' || !target) {
        return false;
      }
      for (var key in filter) {
        if (filter.hasOwnProperty(key) &&
           !partialMatch(target[key], filter[key])) {
            return false;
        }
      }
      return true;
    };
  }
  return function (target) {
    // nodes and links both have data on them
    if (target && target.data === filter) {
      return true;
    }
    if (target === filter) {
      return true;
    }
  };
};

function partialMatch(target, source) {
  // this does not cover deep match
  if (target === source) {
    return true;
  }
  return (typeof target === 'string') &&
         (target.indexOf(source) !== -1);
}
