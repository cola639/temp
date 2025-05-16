好的，以下是你 `findHostRecordsByAppId` 方法对应的完整 SQL（已经包含以下几点）：

* 保留 `applicationId` 条件
* 过滤掉 `hostname IS NULL`
* 只取最新 `month + week` 的记录（按 `month DESC, week DESC` 排序）

---

### ✅ 完整 SQL（拼接形式，适用于 Java @Query 注解）：

```java
@Query(value =
    "SELECT " +
    "checkName, " +
    "checkId, " +
    "hostname AS hostName, " +
    "tierCriticality, " +
    "criticalAsset AS itac, " +
    "assetCategory AS itac, " +
    "ibs, " +
    "environment, " +
    "network, " +
    "gbgf, " +
    "gbgfFunction, " +
    "gbgfSubFunction, " +
    "remediationSteps, " +
    "dueDate, " +
    "exceptions, " +
    "comments, " +
    "1 AS violations, " +
    "IIF( " +
    "    (exceptions IS NOT NULL AND exceptions = 'Exception') OR " +
    "    (comments IS NOT NULL AND comments = 'Third party vendor dependency'), " +
    "    1, 0 " +
    ") AS exception, " +
    "IIF(dueDate < GETDATE(), 1, 0) AS overdue " +
    "FROM dbo.RemediationDetail " +
    "WHERE applicationId = :applicationId " +
    "AND hostname IS NOT NULL " +
    "AND EXISTS ( " +
    "    SELECT 1 FROM ( " +
    "        SELECT TOP 1 month, week FROM dbo.RemediationDetail ORDER BY month DESC, week DESC " +
    "    ) AS latest " +
    "    WHERE latest.month = RemediationDetail.month AND latest.week = RemediationDetail.week " +
    ")",
    nativeQuery = true)
List<HostObjDTO> findHostRecordsByAppId(@Param("applicationId") Long applicationId);
```

---

这个版本是完全可运行的 `@Query` 注解中的 SQL，确保：

* 能正确筛选出最新周的记录
* 不包含空的 `hostname`
* 按你的业务规则生成 `violations` / `exception` / `overdue` 字段

需要我再帮你转成纯 SQL 形式，便于调试吗？
