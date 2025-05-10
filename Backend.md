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



很好！你遇到的问题是：

在 JDK 8 里，

> 三引号 """ 多行字符串（text block） 不支持。

这个功能是 Java 15+ 才引入的。

------

### ✅ 改法：用传统字符串拼接

你需要把：

```java
@Query(value = """
    SELECT ...
""", nativeQuery = true)
```

改成：

```java
@Query(value =
    "WITH latestReport AS ( " +
    "   SELECT TOP 1 month, week " +
    "   FROM dbo.RemediationDetail1 " +
    "   ORDER BY month DESC, week DESC " +
    "), " +
    "userApplications AS ( " +
    "   SELECT DISTINCT applicationId, applicationName, itServiceId, itService " +
    "   FROM dbo.ItsoAppServiceHost " +
    "   WHERE itsoStaffId = :staffId OR itsoDelegateStaffId = :staffId " +
    "), " +
    "violations AS ( " +
    "   SELECT detail.applicationId, detail.itServiceId, " +
    "          CASE WHEN detail.dueDate > GETDATE() THEN 1 ELSE 0 END AS violation_flag, " +
    "          detail.overdue, " +
    "          CASE WHEN (detail.exceptions IS NOT NULL AND detail.exceptions = 'Exception') " +
    "                    OR (detail.comments IS NOT NULL AND detail.comments = 'Third party vendor dependency') " +
    "               THEN 1 ELSE 0 " +
    "          END AS exception_flag " +
    "   FROM dbo.RemediationDetail detail " +
    "   CROSS JOIN latestReport " +
    "   WHERE detail.month = latestReport.month " +
    "     AND detail.week = latestReport.week " +
    "     AND detail.applicationId IN (SELECT applicationId FROM userApplications) " +
    "), " +
    "stat AS ( " +
    "   SELECT applicationId, itServiceId, " +
    "          SUM(violation_flag) AS violations, " +
    "          SUM(overdue) AS total_overdue, " +
    "          SUM(exception_flag) AS exceptions " +
    "   FROM violations " +
    "   GROUP BY applicationId, itServiceId " +
    ") " +
    "SELECT u.applicationName, u.itService, s.violations, s.total_overdue, s.exceptions " +
    "FROM stat s " +
    "JOIN userApplications u ON s.applicationId = u.applicationId AND s.itServiceId = u.itServiceId ",
    nativeQuery = true)
List<Object[]> getAppInstanceStats(@Param("staffId") Long staffId);
```

------

### ✅ 小总结

| 问题                        | 解决方案                                     |
| --------------------------- | -------------------------------------------- |
| JDK 8 不支持 """ 多行字符串 | 改成传统双引号 + 拼接字符串写法              |
| 多行拼接易出错              | 建议用 IDE 格式化好、对齐好，方便维护        |
| 仍要保证 SQL 可读性         | 可以在代码中用空格、换行符明确拼接，防止连死 |

------

如果你需要：
 ✅ 我帮你写成外部 SQL 文件加载（更易维护）
 ✅ 或者帮你写成 MyBatis/QueryDSL 版本
 直接说！我可以一次帮你转好。要吗？



WITH latestReport AS (
    SELECT TOP 1 month, week
    FROM dbo.RemediationDetail1
    ORDER BY month DESC, week DESC
),
userApplications AS (
    SELECT DISTINCT applicationId, applicationName, itServiceId, itService
    FROM dbo.ItsoAppServiceHost
    WHERE itsoStaffId = 45443352 OR itsoDelegateStaffId = 45443352
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
  ON s.applicationId = u.applicationId AND s.itServiceId = u.itServiceId;
