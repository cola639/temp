 public ResponseEntity<String> uploadStaticReports(
            @RequestParam(defaultValue = "1") Integer version,
            @RequestParam List<Integer> months) {

        List<StaticReport> reports = staticReportRepository.findByVersionAndMonthIn(version, months);
        log.info("Found {} reports to process", reports.size());

        int uploaded = 0;
        int skipped = 0;

        for (StaticReport report : reports) {
            try {
                String key = report.getFilename();

                // Step1: 判断是否存在
                if (amazonS3.doesObjectExist(bucketName, key)) {
                    log.info("File {} already exists in S3, skipping", key);
                    skipped++;
                    continue;
                }

                // Step2: 构建 metadata
                ObjectMetadata metadata = new ObjectMetadata();
                metadata.setContentLength(report.getData().length);
                metadata.setContentType("application/octet-stream");
                metadata.addUserMetadata("UploaderStaffId", "123456"); // TODO: 从session里取
                metadata.addUserMetadata("filename", report.getFilename());

                // Step3: 上传
                try (ByteArrayInputStream inputStream = new ByteArrayInputStream(report.getData())) {
                    PutObjectRequest putObjectRequest =
                            new PutObjectRequest(bucketName, key, inputStream, metadata);

                    amazonS3.putObject(putObjectRequest);
                    log.info("Uploaded {} to bucket {}", key, bucketName);
                    uploaded++;
                }

            } catch (Exception e) {
                log.error("Failed to process reportId {}: {}", report.getReportId(), e.getMessage(), e);
            }
        }

        return ResponseEntity.ok(
                String.format("Processed %d reports: %d uploaded, %d skipped",
                        reports.size(), uploaded, skipped));
    }


    @Query(value = "SELECT reportId, reportName, version, month " +
               "FROM StaticReport WHERE version = :version AND month IN (:months)",
       nativeQuery = true)
List<StaticReport> findNeedUploadReport(@Param("version") Integer version,
                                        @Param("months") List<Integer> months);

