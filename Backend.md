public Map<String, List<Map<String, Object>>> buildKci3Summary(List<Kci3> kci3List) {
    // 1. overall: 按平台汇总（DMZ+DRN等网络合并相加）
    Map<String, List<Kci3>> overallGroup = kci3List.stream()
            .collect(Collectors.groupingBy(Kci3::getPlatform, LinkedHashMap::new, Collectors.toList()));
    List<Map<String, Object>> overall = new ArrayList<>();
    int totalAll = 0, scannedAll = 0, notScannedAll = 0;
    for (Map.Entry<String, List<Kci3>> entry : overallGroup.entrySet()) {
        String platform = entry.getKey();
        int total = entry.getValue().stream().mapToInt(Kci3::getCheckable).sum();
        int scanned = entry.getValue().stream().mapToInt(Kci3::getChecked).sum();
        int notScanned = total - scanned;
        String percent = formatPercent(scanned, total);

        Map<String, Object> row = new LinkedHashMap<>();
        row.put("platform", platform);
        row.put("total", total);
        row.put("scanned", scanned);
        row.put("notScanned", notScanned);
        row.put("percent", percent);

        totalAll += total;
        scannedAll += scanned;
        notScannedAll += notScanned;
        overall.add(row);
    }
    // overall 总计行
    Map<String, Object> sumRow = new LinkedHashMap<>();
    sumRow.put("platform", "total");
    sumRow.put("total", totalAll);
    sumRow.put("scanned", scannedAll);
    sumRow.put("notScanned", notScannedAll);
    sumRow.put("percent", formatPercent(scannedAll, totalAll));
    overall.add(0, sumRow);

    // 2. dmz: 只处理network==DMZ的
    List<Map<String, Object>> dmz = buildNetworkList(kci3List, "DMZ");

    // 3. drn: 只处理network==DRN的
    List<Map<String, Object>> drn = buildNetworkList(kci3List, "DRN");

    Map<String, List<Map<String, Object>>> result = new LinkedHashMap<>();
    result.put("overall", overall);
    result.put("dmz", dmz);
    result.put("drn", drn);
    return result;
}

private List<Map<String, Object>> buildNetworkList(List<Kci3> kci3List, String network) {
    Map<String, List<Kci3>> netGroup = kci3List.stream()
            .filter(k -> network.equals(k.getNetwork()))
            .collect(Collectors.groupingBy(Kci3::getPlatform, LinkedHashMap::new, Collectors.toList()));
    List<Map<String, Object>> list = new ArrayList<>();
    int sumTotal = 0, sumScanned = 0, sumNotScanned = 0;
    for (Map.Entry<String, List<Kci3>> entry : netGroup.entrySet()) {
        String platform = entry.getKey();
        int total = entry.getValue().stream().mapToInt(Kci3::getCheckable).sum();
        int scanned = entry.getValue().stream().mapToInt(Kci3::getChecked).sum();
        int notScanned = total - scanned;
        String percent = formatPercent(scanned, total);

        Map<String, Object> row = new LinkedHashMap<>();
        row.put("platform", platform);
        row.put("total", total);
        row.put("scanned", scanned);
        row.put("notScanned", notScanned);
        row.put("percent", percent);

        sumTotal += total;
        sumScanned += scanned;
        sumNotScanned += notScanned;
        list.add(row);
    }
    // 汇总行
    Map<String, Object> sumRow = new LinkedHashMap<>();
    sumRow.put("platform", "total");
    sumRow.put("total", sumTotal);
    sumRow.put("scanned", sumScanned);
    sumRow.put("notScanned", sumNotScanned);
    sumRow.put("percent", formatPercent(sumScanned, sumTotal));
    list.add(0, sumRow);
    return list;
}

private String formatPercent(int scanned, int total) {
    if (total == 0) return "0%";
    double val = scanned * 100.0 / total;
    return (val % 1 == 0) ? String.format("%.0f%%", val) : String.format("%.1f%%", val);
}
