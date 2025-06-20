public Map<String, List<Map<String, Object>>> getKci3SummaryJson(KciThreshold kciThreshold, Integer month) {
    List<Kci3> kci3List = apiService.findKci3List(month);
    kci3List.sort((o1, o2) -> FunctionUtil.platformComparator.compare(o1.getPlatform(), o2.getPlatform()));

    // 分组
    Map<String, List<Kci3>> kci3Map = kci3List.stream()
            .collect(Collectors.groupingBy(Kci3::getPlatform, TreeMap::new, Collectors.toList()));

    // overall
    List<Map<String, Object>> overallList = new ArrayList<>();
    int overallTotal = 0, overallScanned = 0, overallNotScanned = 0;

    for (Map.Entry<String, List<Kci3>> entry : kci3Map.entrySet()) {
        String platform = entry.getKey();
        Kci3 totalKci3 = new Kci3("Total");
        totalKci3.addAll(entry.getValue());

        int total = totalKci3.getCheckable();
        int scanned = totalKci3.getChecked();
        int notScanned = total - scanned;
        String percent = totalKci3.getPercentString(); // 100.1%格式，见下

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("platform", platform);
        map.put("total", total);
        map.put("scanned", scanned);
        map.put("notScanned", notScanned);
        map.put("percent", percent);

        overallTotal += total;
        overallScanned += scanned;
        overallNotScanned += notScanned;

        overallList.add(map);
    }
    // 汇总行
    Map<String, Object> overallSum = new LinkedHashMap<>();
    overallSum.put("platform", "total");
    overallSum.put("total", overallTotal);
    overallSum.put("scanned", overallScanned);
    overallSum.put("notScanned", overallNotScanned);
    overallSum.put("percent", formatPercent(overallScanned, overallTotal));
    overallList.add(0, overallSum);

    // dmz
    List<Map<String, Object>> dmzList = buildSubList(kci3List, "DMZ");
    // drn
    List<Map<String, Object>> drnList = buildSubList(kci3List, "DRN");

    Map<String, List<Map<String, Object>>> result = new LinkedHashMap<>();
    result.put("overall", overallList);
    result.put("dmz", dmzList);
    result.put("drn", drnList);
    return result;
}

// 工具方法，生成dmz/drn分区数据
private List<Map<String, Object>> buildSubList(List<Kci3> kci3List, String networkType) {
    Map<String, List<Kci3>> grouped = kci3List.stream()
            .filter(k -> networkType.equals(k.getNetwork()))
            .collect(Collectors.groupingBy(Kci3::getPlatform, TreeMap::new, Collectors.toList()));
    List<Map<String, Object>> result = new ArrayList<>();
    int totalSum = 0, scannedSum = 0, notScannedSum = 0;
    for (Map.Entry<String, List<Kci3>> entry : grouped.entrySet()) {
        String platform = entry.getKey();
        Kci3 totalKci3 = new Kci3("Total");
        totalKci3.addAll(entry.getValue());

        int total = totalKci3.getCheckable();
        int scanned = totalKci3.getChecked();
        int notScanned = total - scanned;
        String percent = totalKci3.getPercentString();

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("platform", platform);
        map.put("total", total);
        map.put("scanned", scanned);
        map.put("notScanned", notScanned);
        map.put("percent", percent);

        totalSum += total;
        scannedSum += scanned;
        notScannedSum += notScanned;

        result.add(map);
    }
    // 汇总
    Map<String, Object> sum = new LinkedHashMap<>();
    sum.put("platform", "total");
    sum.put("total", totalSum);
    sum.put("scanned", scannedSum);
    sum.put("notScanned", notScannedSum);
    sum.put("percent", formatPercent(scannedSum, totalSum));
    result.add(0, sum);
    return result;
}

// 工具方法，百分比字符串格式化
private String formatPercent(int scanned, int total) {
    if (total == 0) return "0%";
    double val = scanned * 100.0 / total;
    return (val % 1 == 0) ? String.format("%.0f%%", val) : String.format("%.1f%%", val);
}
