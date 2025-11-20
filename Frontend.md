// gbgfBreakdown item example:
// { gbgf: 'AMH Technology', gbgfFunction: 'AMH CMB Tech', gbgfSubFunction: 'Business Banking' }

function getGbgfTree(name, gbgfBreakdown, type) {
  const result = { gbgf: [], gbgfFun: [], gbgfSubFun: [] };

  if (!Array.isArray(gbgfBreakdown) || !name) {
    return result;
  }

  // find first matched row by type
  var row = gbgfBreakdown.find(function (item) {
    if (!item) return false;

    if (type === 'gbgf') {
      return item.gbgf === name;
    }
    if (type === 'gbgfFunction') {
      return item.gbgfFunction === name;
    }
    if (type === 'gbgfSubFunction') {
      return item.gbgfSubFunction === name;
    }
    return false;
  });

  if (!row) return result;

  if (type === 'gbgf') {
    // click top level
    result.gbgf = [row.gbgf];
  } else if (type === 'gbgfFunction') {
    // click function level
    result.gbgf = [row.gbgf];
    result.gbgfFun = [row.gbgfFunction];
  } else if (type === 'gbgfSubFunction') {
    // click sub-function level
    result.gbgf = [row.gbgf];
    result.gbgfFun = [row.gbgfFunction];
    result.gbgfSubFun = [row.gbgfSubFunction];
  }

  return result;
}
