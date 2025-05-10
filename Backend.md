明白了！你想要把这个查询的 nativeQuery 返回值，从

✅ 现在的 → `List<Object[]>`
 转换成更现代、更类型安全的
 ✅ Java 8 写法 → 使用 Stream、DTO 封装、Optional 等，让代码更易读、可维护。

------

### ✅ 改造目标

我们要：
 1️⃣ 保留 JPA Repository 的 nativeQuery
 2️⃣ 将结果在 Service 层用 Java 8 的 **流式处理**（Stream API）转换为 DTO 列表
 3️⃣ 提供类型安全的返回值，而不是 `Object[]`

------

### ✅ 步骤

------

### ① 定义 DTO

```java
public class AppInstanceStatDto {
    private String applicationName;
    private String itService;
    private Integer violations;
    private Integer overdue;
    private Integer exceptions;

    public AppInstanceStatDto(String applicationName, String itService, Integer violations, Integer overdue, Integer exceptions) {
        this.applicationName = applicationName;
        this.itService = itService;
        this.violations = violations;
        this.overdue = overdue;
        this.exceptions = exceptions;
    }

    // getters and toString()
}
```

------

### ② Repository 保持原样

```java
@Repository
public interface AppInstanceRepository extends JpaRepository<AppInstance, Long> {

    @Query(value = """
        WITH latestReport AS (
            SELECT TOP 1 month, week 
            FROM dbo.RemediationDetail1 
            ORDER BY month DESC, week DESC
        ),
        userApplications AS (
            SELECT DISTINCT applicationId, applicationName, itServiceId, itService
            FROM dbo.ItsoAppServiceHost
            WHERE itsoStaffId = :staffId OR itsoDelegateStaffId = :staffId
        ),
        violations AS (
            SELECT 
                detail.applicationId,
                detail.itServiceId,
                CASE WHEN detail.dueDate > GETDATE() THEN 1 ELSE 0 END AS violation_flag,
                detail.overdue,
                CASE 
                    WHEN (detail.exceptions IS NOT NULL AND detail.exceptions = 'Exception') 
                      OR (detail.comments IS NOT NULL AND detail.comments = 'Third party vendor dependency') 
                    THEN 1 ELSE 0 
                END AS exception_flag
            FROM dbo.RemediationDetail detail
            CROSS JOIN latestReport
            WHERE detail.month = latestReport.month
              AND detail.week = latestReport.week
              AND detail.applicationId IN (
                  SELECT applicationId FROM userApplications
              )
        ),
        stat AS (
            SELECT 
                applicationId,
                itServiceId,
                SUM(violation_flag) AS violations,
                SUM(overdue) AS total_overdue,
                SUM(exception_flag) AS exceptions
            FROM violations
            GROUP BY applicationId, itServiceId
        )
        SELECT 
            u.applicationName,
            u.itService,
            s.violations,
            s.total_overdue,
            s.exceptions
        FROM stat s
        JOIN userApplications u 
          ON s.applicationId = u.applicationId AND s.itServiceId = u.itServiceId
        """, nativeQuery = true)
    List<Object[]> getAppInstanceStats(@Param("staffId") Long staffId);
}
```

------

### ③ Service 层用 Java 8 流式转换

```java
@Service
public class AppInstanceService {

    @Autowired
    private AppInstanceRepository repository;

    public List<AppInstanceStatDto> getStatsByStaff(Long staffId) {
        List<Object[]> rawList = repository.getAppInstanceStats(staffId);

        return rawList.stream()
                .map(obj -> new AppInstanceStatDto(
                        (String) obj[0],
                        (String) obj[1],
                        (Integer) obj[2],
                        (Integer) obj[3],
                        (Integer) obj[4]
                ))
                .collect(Collectors.toList());
    }
}
```

------

### ④ Controller 保持类型安全

```java
@RestController
@RequestMapping("/api/app-instances")
public class AppInstanceController {

    @Autowired
    private AppInstanceService service;

    @GetMapping("/stats")
    public List<AppInstanceStatDto> getStats(@RequestParam Long staffId) {
        return service.getStatsByStaff(staffId);
    }
}
```

------

### ✅ 优势

✔ 使用 Java 8 Stream → 简洁高效
 ✔ 结果用 DTO 封装 → 类型安全
 ✔ Controller 返回 JSON → 前端更易消费
 ✔ Service 层未来可扩展 Optional、filter、sorted、limit 等链式操作

------

