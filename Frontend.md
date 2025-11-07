// Example shape assumed:
// const gbgfTree = [
//   {
//     name: "AMH Technology",
//     gbgfFunctionList: [
//       { name: "AMH CMB Tech", gbgfSubFunctionList: ["PayMe", "Pensions HK"] },
//       { name: "AMH RB & Wealth Tech", gbgfSubFunctionList: ["..."] },
//     ],
//   },
//   // ...
// ];

const norm = v => String(v ?? "").trim().toLowerCase();

/**
 * Find a name at any depth (0/1/2) and return its path.
 * - match at level 0  -> { gbgf:[name], gbgfFun:[], gbgfSubFun:[] }
 * - match at level 1  -> { gbgf:[parent], gbgfFun:[name], gbgfSubFun:[] }
 * - match at level 2  -> { gbgf:[grandParent], gbgfFun:[parent], gbgfSubFun:[name] }
 * If not found -> empty arrays.
 */
function getGbgfTree(name, tree = gbgfTree) {
  const target = norm(name);

  for (const p of tree || []) {
    const pName = p?.name;
    if (norm(pName) === target) {
      return { gbgf: [pName], gbgfFun: [], gbgfSubFun: [] };
    }

    for (const f of p?.gbgfFunctionList || []) {
      const fName = f?.name;
      if (norm(fName) === target) {
        return { gbgf: [pName], gbgfFun: [fName], gbgfSubFun: [] };
        }

      for (const s of f?.gbgfSubFunctionList || []) {
        const sName = typeof s === "string" ? s : s?.name;
        if (norm(sName) === target) {
          return { gbgf: [pName], gbgfFun: [fName], gbgfSubFun: [sName] };
        }
      }
    }
  }

  // not found
  return { gbgf: [], gbgfFun: [], gbgfSubFun: [] };
}
