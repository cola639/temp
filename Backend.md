String reportName = report.getReportName().toLowerCase();

Set<String> groups = new HashSet<>(Arrays.asList("kci", "kpi", "rcmm"));
String prefix;

if ("violation".equals(reportName)) {
    prefix = "violation";
} else if (groups.contains(reportName)) {
    prefix = reportName;
} else {
    prefix = "other"; // just in case
}

String keyName = String.format("%s/%d", prefix, report.getReportId());
