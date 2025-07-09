@Slf4j
@RequiredArgsConstructor
@Service
public class ExemptedViolationService {

    private final ExemptedViolationRepository exemptedViolationRepository;

    @Transactional
    public void loadExemptedViolation(String basePath, int month) throws Exception {
        File file = new File(basePath + "/Unix_Linux/tanium-compliance-summary.csv");
        if (!file.exists()) {
            log.error("CSV file not found: {}", file.getAbsolutePath());
            return;
        }

        // 先清空表
        exemptedViolationRepository.deleteAll();
        log.info("ExemptedViolation table cleared.");

        List<ExemptedViolation> batchList = new ArrayList<>();
        int batchSize = 1000;

        try (FileInputStream inputStream = new FileInputStream(file)) {
            CsvReader csvReader = new CsvReader(inputStream, true); // hasHeader = true

            int idIndex = csvReader.getIndex("ID");
            int platformIndex = csvReader.getIndex("Platform");
            int hostnameIndex = csvReader.getIndex("Hostname");
            int checkIdIndex = csvReader.getIndex("Check ID");
            int checkNameIndex = csvReader.getIndex("Check Name");

            csvReader.forEach(record -> {
                // 防御下标
                String id = (record.length > idIndex && idIndex >= 0) ? record[idIndex] : "";
                String platform = (record.length > platformIndex && platformIndex >= 0) ? record[platformIndex] : "";
                String hostname = (record.length > hostnameIndex && hostnameIndex >= 0) ? record[hostnameIndex] : "";
                String checkId = (record.length > checkIdIndex && checkIdIndex >= 0) ? record[checkIdIndex] : "";
                String checkName = (record.length > checkNameIndex && checkNameIndex >= 0) ? record[checkNameIndex] : "";

                if (id.isEmpty() || platform.isEmpty() || hostname.isEmpty()) {
                    log.warn("Skip row due to missing key field: {}", Arrays.toString(record));
                    return;
                }

                ExemptedViolation ev = ExemptedViolation.builder()
                        .id(id.trim())
                        .platform(platform.trim())
                        .hostname(hostname.trim())
                        .checkId(checkId == null ? "" : checkId.trim())
                        .checkName(checkName == null ? "" : checkName.trim())
                        .createdDate(Instant.now())
                        .build();

                batchList.add(ev);
                if (batchList.size() >= batchSize) {
                    exemptedViolationRepository.saveAll(batchList);
                    log.info("Batch inserted {} records.", batchList.size());
                    batchList.clear();
                }
            });

            // 最后一批
            if (!batchList.isEmpty()) {
                exemptedViolationRepository.saveAll(batchList);
                log.info("Batch inserted last {} records.", batchList.size());
            }
        } catch (Exception ex) {
            log.error("Failed to load exempted violation from csv", ex);
            throw ex;
        }
    }
}
