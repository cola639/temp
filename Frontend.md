// name normalizer you already have
// function norm(str) { ... }

function getGbgfTree(name, tree = gbgfTree) {
  const target = norm(name);
  const empty = {
    businessLv3: [],
    gbgf: [],
    gbgfFunction: [],
    gbgfSubFunction: []
  };

  if (!tree || !tree.length) return empty;

  for (const b of tree || []) {
    const bName = b && b.name;

    // level 1: businessLv3
    if (norm(bName) === target) {
      return {
        businessLv3: [bName],
        gbgf: [],
        gbgfFunction: [],
        gbgfSubFunction: []
      };
    }

    // level 2: gbgf under this business
    for (const g of b?.gbgfList || []) {
      const gName = g && g.name;

      if (norm(gName) === target) {
        return {
          businessLv3: [bName],
          gbgf: [gName],
          gbgfFunction: [],
          gbgfSubFunction: []
        };
      }

      // level 3: gbgfFunction under this gbgf
      for (const f of g?.gbgfFunctionList || []) {
        const fName = f && f.name;

        if (norm(fName) === target) {
          return {
            businessLv3: [bName],
            gbgf: [gName],
            gbgfFunction: [fName],
            gbgfSubFunction: []
          };
        }

        // level 4: gbgfSubFunction under this function
        for (const s of f?.gbgfSubFunctionList || []) {
          const sName = typeof s === 'string' ? s : s && s.name;

          if (norm(sName) === target) {
            return {
              businessLv3: [bName],
              gbgf: [gName],
              gbgfFunction: [fName],
              gbgfSubFunction: [sName]
            };
          }
        }
      }
    }
  }

  // not found
  return empty;
}
