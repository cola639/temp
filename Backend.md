@Query("SELECT h.gbgf FROM ItsoAppServiceHost h WHERE h.applicationId = :applicationId AND h.hostname = :hostname")
String findGbgf(@Param("applicationId") String applicationId, @Param("hostname") String hostname);


@Query("SELECT h.applicationId, h.hostname, h.gbgf FROM ItsoAppServiceHost h WHERE h.applicationId IN :applicationIds AND h.hostname IN :hostnames")
Map<String, String> findGbgfForBatch(@Param("applicationIds") Set<String> applicationIds, @Param("hostnames") Set<String> hostnames);


public void fillViolationRemediationPlan(File file) throws Exception {
    List<ViolationRemediationPlan> batchList = new ArrayList<>();
    int batchSize = 1000;

    try (FileInputStream inputStream = new FileInputStream(file)) {
        ExcelReader excelReader = new ExcelReader(inputStream);
        excelReader.openSheet(sheetIndex);
        excelReader.indexHeaders();

        // 获取字段索引
        int idIndex = excelReader.getIndex(headerName: "ID");
        int remediationStatusIndex = excelReader.getIndex(headerName: "Remediation Status");
        int remediationDateIndex = excelReader.getIndex(headerName: "Planned Remediation Date");
        int hostnameIndex = excelReader.getIndex(headerName: "Hostname");
        int applicationIdIndex = excelReader.getIndex(headerName: "Application ID");

        // 从数据库批量查询所有相关的 gbgf 值
        Set<String> applicationIds = new HashSet<>();
        Set<String> hostnames = new HashSet<>();
        excelReader.forEach(record -> {
            applicationIds.add(record.getString(applicationIdIndex));
            hostnames.add(record.getString(hostnameIndex));
        });

        // 批量查询 gbfg 值
        Map<String, String> gbgfMap = itsoAppServiceHostRepository.findGbgfForBatch(applicationIds, hostnames);

        // 遍历 CSV 记录并构建 ViolationRemediationPlan 对象
        excelReader.forEach(record -> {
            String id = record.getString(idIndex);
            String remediationStatus = record.getString(remediationStatusIndex);
            Date remediationDate = record.getDate(remediationDateIndex);

            // 获取 applicationId 和 hostname
            String applicationId = record.getString(applicationIdIndex);
            String hostname = record.getString(hostnameIndex);

            // 获取 gbgf (从缓存中获取)
            String gbgf = gbgfMap.get(applicationId + "-" + hostname);

            // 创建 ViolationRemediationPlan 实例
            ViolationRemediationPlan vp = new ViolationRemediationPlan();
            vp.setId(id);
            vp.setRemediationStatus(remediationStatus);
            vp.setRemediationDate(remediationDate);
            vp.setGbgf(gbgf); // 设置 gbgf

            // 设置其它字段
            vp.setApplicationId(applicationId);
            vp.setHostname(hostname);

            // 处理批量插入
            batchList.add(vp);

            // 批量插入逻辑
            if (batchList.size() >= batchSize) {
                violationRemediationPlanRepository.saveAll(batchList);
                log.info("Batch inserted {} records.", batchList.size());
                batchList.clear(); // 清空列表
            }
        });

        // 插入剩余未满批次的数据
        if (!batchList.isEmpty()) {
            violationRemediationPlanRepository.saveAll(batchList);
            log.info("Batch inserted {} records.", batchList.size());
        }

    } catch (Exception ex) {
        log.error("Failed to load violation from CSV", ex);
    }
}
