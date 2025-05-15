const data = [
  {
    hostName: "hkl25108934",
    checkId: "IS1701",
    platform: "Linux",
    risk: "High",
    status: "Pending",
    violations: 1,
    exception: 1
  },
  {
    hostName: "hkl25108934",
    checkId: "IS1702",
    platform: "Linux",
    risk: "Medium",
    status: "Approved",
    violations: 1,
    exception: 0
  },
  {
    hostName: "hkl25108935",
    checkId: "IS1703",
    platform: "Windows",
    risk: "Low",
    status: "Approved",
    violations: 0,
    exception: 1
  },
  {
    hostName: "hkl25108935",
    checkId: "IS1704",
    platform: "Windows",
    risk: "High",
    status: "Pending",
    violations: 1,
    exception: 1
  }
];


// ✅ Step 1: 构建唯一 hostName 对象 Map（只保留第一次出现）
const uniqueHostMap = new Map();
data.forEach(item => {
  if (!uniqueHostMap.has(item.hostName)) {
    uniqueHostMap.set(item.hostName, item);
  }
});

// ✅ Step 2: 按 hostName 分组，细分 violation/exception
const groupedHostList = Object.values(
  data.reduce((acc, item) => {
    const host = item.hostName || "UNKNOWN";

    if (!acc[host]) {
      acc[host] = {
        hostName: host,
        violationList: [],
        exceptionList: []
      };
    }

    if (item.violations === 1) {
      acc[host].violationList.push(item);
    }

    if (item.exception === 1) {
      acc[host].exceptionList.push(item);
    }

    return acc;
  }, {})
).map(group => ({
  ...group,
  violationListLength: group.violationList.length,
  exceptionListLength: group.exceptionList.length
}));

// ✅ Step 3: enrich 每组的基本信息字段
const enrichedGroupedHostList = groupedHostList.map(group => {
  const base = uniqueHostMap.get(group.hostName) || {};

  return {
    ...group,
    checkId: base.checkId,
    platform: base.platform,
    risk: base.risk,
    status: base.status
  };
});


// ✅ 输出最终结构
console.log(JSON.stringify(enrichedGroupedHostList, null, 2));
