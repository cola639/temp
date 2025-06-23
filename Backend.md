// 1. 组装 gbfgSummaryList
List<Map<String, Object>> gbfgSummaryList = newList.stream().map(detail -> {
    Map<String, Object> map = new LinkedHashMap<>();
    map.put("gbgf", detail.getGbgf());
    map.put("total", detail.getTotal());
    map.put("withoutHighViolations", detail.getTotal() - detail.getFail());
    map.put("fail", detail.getFail());
    String percent = formatPercent(detail.getTotal() - detail.getFail(), detail.getTotal());
    map.put("percent", percent);
    return map;
}).collect(Collectors.toList());

// 2. 汇总 gbfgSummaryList
int gbgfTotal = 0, gbgfWithoutHighViolations = 0, gbgfTotalFail = 0;
for (Map<String, Object> row : gbfgSummaryList) {
    gbgfTotal += (int) row.get("total");
    gbgfWithoutHighViolations += (int) row.get("withoutHighViolations");
    gbgfTotalFail += (int) row.get("fail");
}
Map<String, Object> gbgfSumRow = new LinkedHashMap<>();
gbgfSumRow.put("gbgf", "Total");
gbgfSumRow.put("total", gbgfTotal);
gbgfSumRow.put("withoutHighViolations", gbgfWithoutHighViolations);
gbgfSumRow.put("fail", gbgfTotalFail);
gbgfSumRow.put("percent", formatPercent(gbgfWithoutHighViolations, gbgfTotal));
gbfgSummaryList.add(gbgfSumRow);

// 3. 组装 cspSummaryList
List<Map<String, Object>> cspSummaryList = kpiCspSummaryList.stream().map(detail -> {
    Map<String, Object> map = new LinkedHashMap<>();
    map.put("platform", detail.getPlatform());
    map.put("total", detail.getTotal());
    map.put("withoutHighViolations", detail.getTotal() - detail.getFail());
    map.put("fail", detail.getFail());
    String percent = formatPercent(detail.getTotal() - detail.getFail(), detail.getTotal());
    map.put("percent", percent);
    return map;
}).collect(Collectors.toList());

// 4. 汇总 cspSummaryList
int cspTotal = 0, cspWithoutHighViolations = 0, cspTotalFail = 0;
for (Map<String, Object> row : cspSummaryList) {
    cspTotal += (int) row.get("total");
    cspWithoutHighViolations += (int) row.get("withoutHighViolations");
    cspTotalFail += (int) row.get("fail");
}
Map<String, Object> cspSumRow = new LinkedHashMap<>();
cspSumRow.put("platform", "Total");
cspSumRow.put("total", cspTotal);
cspSumRow.put("withoutHighViolations", cspWithoutHighViolations);
cspSumRow.put("fail", cspTotalFail);
cspSumRow.put("percent", formatPercent(cspWithoutHighViolations, cspTotal));
cspSummaryList.add(cspSumRow);
