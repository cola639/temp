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
);
