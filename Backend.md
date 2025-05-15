const uniqueHostMap = new Map();

data.forEach(item => {
  if (!uniqueHostMap.has(item.hostName)) {
    uniqueHostMap.set(item.hostName, item);
  }
});

const uniqueHostArray = Array.from(uniqueHostMap.values());

console.log(uniqueHostArray);


