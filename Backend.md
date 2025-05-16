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


你想用 **原生 SQL + 分页 + applicationId 筛选 + auditLevel IN (1, 2)** 来查 `ActivityLog` 表，可以按以下步骤实现：

---

### ✅ 第一步：Repository 方法定义

使用 `nativeQuery = true` 和分页参数：

```java
@Query(
    value = "SELECT * FROM ActivityLog " +
            "WHERE auditLevel IN (1, 2) AND applicationId = :applicationId " +
            "ORDER BY actionDate DESC",
    countQuery = "SELECT COUNT(*) FROM ActivityLog " +
                 "WHERE auditLevel IN (1, 2) AND applicationId = :applicationId",
    nativeQuery = true
)
Page<ActivityLog> findByApplicationIdWithAuditLevels(
    @Param("applicationId") Long applicationId,
    Pageable pageable
);
```

---

### ✅ 第二步：Service 层调用

```java
public Page<ActivityLog> findApplicationLogs(Long applicationId, int page, int size) {
    Pageable pageable = PageRequest.of(page, size);
    return activityLogRepository.findByApplicationIdWithAuditLevels(applicationId, pageable);
}
```

---

### ✅ 第三步：Controller 层

```java
@GetMapping("/getActiveLog")
public ResponseEntity<ResponseBody> getActiveLog(@RequestParam Long applicationId,
                                                 @RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size) {
    Page<ActivityLog> logs = logService.findApplicationLogs(applicationId, page, size);
    return ResponseBody.ok("Fetch successful", logs);
}
```

---

### ✅ 最后别忘了导入分页类：

```java
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
```

---

### 小结：

| 功能        | 已支持                                           |
| --------- | --------------------------------------------- |
| 原生 SQL 查询 | ✅ `@Query(nativeQuery = true)`                |
| 多条件筛选     | ✅ `auditLevel IN (1,2) AND applicationId = ?` |
| 分页        | ✅ `Pageable` + `countQuery`                   |
| 排序        | ✅ `ORDER BY actionDate DESC`                  |

---

如果你希望返回自定义字段（比如只查 `message`, `actionDate`），也可以用 `interface projection`。需要我也配吗？

