List<Kci4> kci4List = kci4Service.findKci4ByMonth(month);

List<Map<String, Object>> result = new ArrayList<>();

int totalTotal = 0;
int totalPublished = 0;
int totalNotPublished = 0;

for (Kci4 kci4 : kci4List) {
    Map<String, Object> kciObj = new LinkedHashMap<>();
    kciObj.put("platform", kci4.getKci4Id().getPlatform());
    int total = kci4.getTotalProduct();
    int published = kci4.getAutomatedProduct();
    int notPublished = total - published;

    double percentValue = total == 0 ? 0 : (published * 100.0 / total);
    String percentStr = (percentValue % 1 == 0) ? String.format("%.0f%%", percentValue) : String.format("%.1f%%", percentValue);

    kciObj.put("total", total);
    kciObj.put("published", published);
    kciObj.put("notPublished", notPublished);
    kciObj.put("kci4Percent", percentStr);

    // 统计汇总
    totalTotal += total;
    totalPublished += published;
    totalNotPublished += notPublished;

    result.add(kciObj);
}

// 追加Total汇总行
double totalPercentValue = totalTotal == 0 ? 0 : (totalPublished * 100.0 / totalTotal);
String totalPercentStr = (totalPercentValue % 1 == 0) ? String.format("%.0f%%", totalPercentValue) : String.format("%.1f%%", totalPercentValue);

Map<String, Object> totalObj = new LinkedHashMap<>();
totalObj.put("platform", "Total");
totalObj.put("total", totalTotal);
totalObj.put("published", totalPublished);
totalObj.put("notPublished", totalNotPublished);
totalObj.put("kci4Percent", totalPercentStr);

result.add(totalObj);

return ResponseBody.ok("Success", result);
