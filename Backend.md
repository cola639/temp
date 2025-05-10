好的！我帮你把这个复杂 SQL 改写成 JPA repository 查询。

因为 JPA 不直接支持 WITH 子句（CTE），所以我们需要用 @Query(nativeQuery = true) + 传入参数实现。

—

✅ 示例 Repository 接口：

```java
@Repository
public interface AppInstanceRepository extends JpaRepository<AppInstance, Long> {

    @Query(value =
        "WITH lastestReport AS ( " +
        "    SELECT TOP 1 month, week " +
        "    FROM dbo.RemediationDetail " +
        "    ORDER BY month DESC, week DESC " +
        "), " +
        "appNameSerName AS ( " +
        "    SELECT DISTINCT CAST(applicationId AS BIGINT) AS applicationId, " +
        "           applicationName, itServiceId, itService " +
        "    FROM dbo.ItsoAppServiceHost " +
        "    WHERE CAST(itsoStaffId AS varchar) = :staffId " +
        "       OR itsoDelegateStaffId = :staffId " +
        "), " +
        "violations AS ( " +
        "    SELECT detail.applicationId, detail.itServiceId, " +
        "           1 AS violations, " +
        "           IIF(dueDate > GETDATE(), 1, 0) AS overdue, " +
        "           IIF((exceptions IS NOT NULL AND exceptions = 'Exception') " +
        "               OR (comments IS NOT NULL AND comments = 'Third party vendor dependency'), 1, 0) AS exception " +
        "    FROM dbo.RemediationDetail detail " +
        "    INNER JOIN lastestReport ON detail.month = lastestReport.month AND detail.week = lastestReport.week " +
        "    WHERE detail.applicationId IN ( " +
        "        SELECT CAST(applicationId AS BIGINT) " +
        "        FROM dbo.ItsoAppServiceHost " +
        "        WHERE CAST(itsoStaffId AS varchar) = :staffId " +
        "           OR itsoDelegateStaffId = :staffId " +
        "    ) " +
        "), " +
        "stat AS ( " +
        "    SELECT applicationId, itServiceId, " +
        "           SUM(violations) AS violations, " +
        "           SUM(overdue) AS overdue, " +
        "           SUM(exception) AS exceptions " +
        "    FROM violations " +
        "    GROUP BY applicationId, itServiceId " +
        ") " +
        "SELECT u.applicationName, u.itService, s.* " +
        "FROM stat s " +
        "INNER JOIN appNameSerName u " +
        "    ON s.applicationId = u.applicationId AND s.itServiceId = u.itServiceId",
        nativeQuery = true)
    List<Object[]> getAppInstanceStats(@Param("staffId") String staffId);
}
```

—

✅ 调用 Service 层：

```java
@Service
public class AppInstanceService {

    @Autowired
    private AppInstanceRepository appInstanceRepository;

    public List<Object[]> getStatsForStaff(String staffId) {
        return appInstanceRepository.getAppInstanceStats(staffId);
    }
}
```

—

✅ Controller 接口：

```java
@RestController
@RequestMapping("/api/app-instances")
public class AppInstanceController {

    @Autowired
    private AppInstanceService appInstanceService;

    @GetMapping("/stats")
    public List<Object[]> getStats(@RequestParam String staffId) {
        return appInstanceService.getStatsForStaff(staffId);
    }
}
```

—

⚠ 注意：
 1️⃣ 由于 native query 返回的是 `Object[]`，需要在 service 或 controller 里自己包装成 DTO 或 Map
 2️⃣ staffId 在 SQL 里我们用了 `CAST(itsoStaffId AS varchar)`，所以 controller 接口也统一用 String 传入

—

如果你需要：
 ✅ 帮你写好对应的 DTO 封装
 ✅ 改成分页查询
 ✅ 用 @SqlResultSetMapping 自动映射结果

直接跟我说，我帮你写全套！要吗？
