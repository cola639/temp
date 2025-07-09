@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExemptedViolation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long exemptedViolationId;

    private String id;
    private String platform;
    private String hostname;
    private String checkId;
    private String checkName;
    private LocalDateTime createdDate;
}


public interface ExemptedViolationRepository extends JpaRepository<ExemptedViolation, Long> {
    // 可加自定义方法

    @Modifying
    @Query("DELETE FROM ExemptedViolation")
    void deleteAllExempted();
}


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

        List<ExemptedViolation> batchList = new ArrayList<>();

        try (FileInputStream inputStream = new FileInputStream(file)) {
            CsvReader csvReader = new CsvReader(inputStream, true); // 你的构造方法，hasHeader传true
            int idIndex = csvReader.getIndex("ID");
            int platformIndex = csvReader.getIndex("Platform");
            int hostnameIndex = csvReader.getIndex("Hostname");
            int checkIdIndex = csvReader.getIndex("Check ID");
            int checkNameIndex = csvReader.getIndex("Check Name");

            while (csvReader.hasNext()) {
                String[] record = csvReader.next();
                // 可防御处理，防止数组越界或空指针
                String id = record.length > idIndex ? record[idIndex] : "";
                String platform = record.length > platformIndex ? record[platformIndex] : "";
                String hostname = record.length > hostnameIndex ? record[hostnameIndex] : "";
                String checkId = record.length > checkIdIndex ? record[checkIdIndex] : "";
                String checkName = record.length > checkNameIndex ? record[checkNameIndex] : "";

                // 基本校验
                if (id.isEmpty() || platform.isEmpty() || hostname.isEmpty()) {
                    log.warn("Skip row due to missing key field: {}", Arrays.toString(record));
                    continue;
                }

                ExemptedViolation ev = ExemptedViolation.builder()
                        .id(id.trim())
                        .platform(platform.trim())
                        .hostname(hostname.trim())
                        .checkId(checkId == null ? "" : checkId.trim())
                        .checkName(checkName == null ? "" : checkName.trim())
                        .createdDate(LocalDateTime.now())
                        .build();

                batchList.add(ev);
                if (batchList.size() >= 1000) {
                    exemptedViolationRepository.saveAll(batchList);
                    log.info("Batch inserted 1000 records.");
                    batchList.clear();
                }
            }

            // 剩余批量提交
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



csvReader.forEach(record -> {
    // 下标防御性处理
    String id = (record.length > idIndex && idIndex >= 0) ? record[idIndex] : "";
    String platform = (record.length > platformIndex && platformIndex >= 0) ? record[platformIndex] : "";
    String hostname = (record.length > hostnameIndex && hostnameIndex >= 0) ? record[hostnameIndex] : "";
    String checkId = (record.length > checkIdIndex && checkIdIndex >= 0) ? record[checkIdIndex] : "";
    String checkName = (record.length > checkNameIndex && checkNameIndex >= 0) ? record[checkNameIndex] : "";

    // 必填字段校验
    if (id.isEmpty() || platform.isEmpty() || hostname.isEmpty()) {
        log.warn("Skip row due to missing key field: {}", Arrays.toString(record));
        return; // 跳过本行
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

    if (batchList.size() >= 1000) {
        exemptedViolationRepository.saveAll(batchList);
        log.info("Batch inserted 1000 records.");
        batchList.clear();
    }
});

// 最后一批
if (!batchList.isEmpty()) {
    exemptedViolationRepository.saveAll(batchList);
    log.info("Batch inserted last {} records.", batchList.size());
}
