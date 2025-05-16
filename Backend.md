好的！以下是配套的 DTO 方案，用于原生 SQL + 分页查询时，返回自定义字段结构更轻便。

---

## ✅ 一、你要的字段（参考表结构）

比如我们只关心这些字段：

* `logId`
* `auditLevel`
* `message`
* `actionDate`
* `applicationId`

---

## ✅ 二、创建 DTO 类

```java
public interface ActivityLogDTO {
    Long getLogId();
    Integer getAuditLevel();
    String getMessage();
    Instant getActionDate();
    Long getApplicationId();
}
```

这是 Spring Data JPA 的 **interface-based projection**：只要方法名和 SQL 列名对上即可，无需写构造函数。

---

## ✅ 三、Repository 改成 DTO 查询

```java
@Query(
    value = "SELECT logId, auditLevel, message, actionDate, applicationId " +
            "FROM ActivityLog " +
            "WHERE auditLevel IN (1, 2) AND applicationId = :applicationId " +
            "ORDER BY actionDate DESC",
    countQuery = "SELECT COUNT(*) FROM ActivityLog " +
                 "WHERE auditLevel IN (1, 2) AND applicationId = :applicationId",
    nativeQuery = true
)
Page<ActivityLogDTO> findDTOByApplicationIdWithAuditLevels(
    @Param("applicationId") Long applicationId,
    Pageable pageable
);
```

---

## ✅ 四、Controller 层调用（略）

用 `Page<ActivityLogDTO>` 返回即可，和实体返回方式一致。

---

## 小提示：

* DTO 字段要匹配 SQL 返回列名。
* `actionDate` 是 `datetime2`，建议 DTO 中用 `Instant`、`Timestamp` 或 `LocalDateTime`。
* 如果你希望用 `@SqlResultSetMapping + @ConstructorResult` 方式做更复杂 DTO，也可以，我可以写一版给你。

要不要？
