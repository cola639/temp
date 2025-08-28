String bucketName = s3Service.getS3Properties().getBucketName();
String keyName = String.format("report/%s/%s/%s/%s",
        report.getReportName(), report.getReportType(), report.getMonth(), report.getFilename());

// 检查是否已存在
boolean isExist = s3Service.getAmazonS3().doesObjectExist(bucketName, keyName);
if (isExist) {
    log.info("File {} already exists in S3, skipping", keyName);
    skipped++;
    continue;
}

// 构建 Metadata
ObjectMetadata metadata = new ObjectMetadata();
metadata.setContentLength(report.getData().length);
metadata.setContentType("application/octet-stream");
metadata.addUserMetadata("UploaderStaffId", staffId);
metadata.addUserMetadata("filename", report.getFilename());

// 上传
try (InputStream inputStream = new ByteArrayInputStream(report.getData())) {
    PutObjectRequest putObjectRequest =
            new PutObjectRequest(bucketName, keyName, inputStream, metadata);

    s3Service.getAmazonS3().putObject(putObjectRequest);
    log.info("Uploaded {} to bucket {}", keyName, bucketName);
    uploaded++;
} catch (Exception e) {
    log.error("Failed to upload {}: {}", keyName, e.getMessage(), e);
}
