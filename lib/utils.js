module.exports = {
  addFilterForSet: addFilter
};

function addFilter(filters, filterName, set) {
  if (isArray(set)) {
    filters[filterName] = set;
  } else if (set && typeof set.forEach === 'function') {
    filters[filterName] = createDelayedIdGetter(set)
  } else {
    filters[filterName] = [set];
  }
}

function createDelayedIdGetter(set) {
  return function getNodeIds() {
    var elementIds = [];
    set.forEach(function (element) { elementIds.push(element.id); });
    return elementIds;
  };
}

function isArray(obj) {
  if (typeof obj === 'undefined') { return false; }
  return Object.prototype.toString.call(obj).indexOf("[object Array]") === 0;
}
