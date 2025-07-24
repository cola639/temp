int platformIndex = excelReader.getIndex("Platform");
int hostnameIndex = excelReader.getIndex("Hostname");
int checkIdIndex = excelReader.getIndex("Check ID");
int checkNameIndex = excelReader.getIndex("Check Name");
int idIndex = excelReader.getIndex("ID");
int commentIndex = excelReader.getIndex("Comment Category");
int expiryDateIndex = excelReader.getIndex("Expiry Date");
int heliosIssueIdIndex = excelReader.getIndex("Helios Issue ID");
int rationaleIndex = excelReader.getIndex("Rationale");
int sourceIndex = excelReader.getIndex("Source");
int submittedOnIndex = excelReader.getIndex("Submitted On");
int submittedByIndex = excelReader.getIndex("Submitted By");
int l1ReviewedOnIndex = excelReader.getIndex("L1 Reviewed On");
int l1ReviewedByIndex = excelReader.getIndex("L1 Reviewed By");
int l2ReviewedOnIndex = excelReader.getIndex("L2 Reviewed On");
int l2ReviewedByIndex = excelReader.getIndex("L2 Reviewed By");

SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MMM-yyyy", Locale.ENGLISH);

excelReader.forEach(record -> {
    ExceptionRequestViolation exceptionRequestViolation = new ExceptionRequestViolation();

    exceptionRequestViolation.setPlatformName(record.getString(platformIndex));
    exceptionRequestViolation.setHostname(record.getString(hostnameIndex));
    exceptionRequestViolation.setCheckId(record.getString(checkIdIndex));
    exceptionRequestViolation.setCheckName(record.getString(checkNameIndex));
    exceptionRequestViolation.setId(record.getString(idIndex));
    exceptionRequestViolation.setComment(record.getString(commentIndex));
    exceptionRequestViolation.setHeliosIssueId(record.getString(heliosIssueIdIndex));
    exceptionRequestViolation.setRationale(record.getString(rationaleIndex));
    exceptionRequestViolation.setSource(record.getString(sourceIndex));
    exceptionRequestViolation.setSubmitterStaffId(record.getString(submittedByIndex));

    // 日期类型处理
    try {
        exceptionRequestViolation.setExpiryDate(dateFormat.parse(record.getString(expiryDateIndex)));
    } catch (Exception ignore) {}
    try {
        exceptionRequestViolation.setSubmittedDate(dateFormat.parse(record.getString(submittedOnIndex)));
    } catch (Exception ignore) {}
    try {
        exceptionRequestViolation.setFirstReviewedDate(dateFormat.parse(record.getString(l1ReviewedOnIndex)));
    } catch (Exception ignore) {}
    try {
        exceptionRequestViolation.setSecondReviewedDate(dateFormat.parse(record.getString(l2ReviewedOnIndex)));
    } catch (Exception ignore) {}

    exceptionRequestViolation.setFirstApproverStaffId(record.getString(l1ReviewedByIndex));
    exceptionRequestViolation.setSecondApproverStaffId(record.getString(l2ReviewedByIndex));

    batchList.add(exceptionRequestViolation);
});
