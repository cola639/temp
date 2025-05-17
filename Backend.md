好的，以下是完整实现：使用 **原生 SQL 查询 `ActivityLog` 表**，**按 `applicationId` 和 `auditLevel IN (1,2)` 条件**，**返回 `ActiveLogsDTO` 列表**，**不分页**。

---

## ✅ 1. DTO 定义

```java
public interface ActiveLogsDTO {
    Long getLogId();
    Integer getAuditLevel();
    String getMessage();
    Instant getActionDate();
    Long getApplicationId();
}
```

> 用 interface DTO，Spring 自动映射列名，无需构造函数。

---

## ✅ 2. Repository 方法

```java
@Query(value = "SELECT logId, auditLevel, message, actionDate, applicationId " +
               "FROM ActivityLog " +
               "WHERE auditLevel IN (1, 2) AND applicationId = :applicationId " +
               "ORDER BY actionDate DESC",
       nativeQuery = true)
List<ActiveLogsDTO> findDTOByApplicationIdWithAuditLevels(@Param("applicationId") Long applicationId);
```

---

## ✅ 3. Service 实现

```java
@Service
public class LogService {
    @Autowired
    private ActivityLogRepository activityLogRepository;

    public List<ActiveLogsDTO> getActiveLogs(Long applicationId) {
        return activityLogRepository.findDTOByApplicationIdWithAuditLevels(applicationId);
    }
}
```

---

## ✅ 4. Controller 接口

```java
@RestController
@RequestMapping("/logs")
public class LogController {
    @Autowired
    private LogService logService;

    @GetMapping("/getActiveLog")
    public ResponseEntity<ResponseBody> getActiveLog(@RequestParam Long applicationId) {
        List<ActiveLogsDTO> logs = logService.getActiveLogs(applicationId);
        return ResponseBody.ok("Fetch successful", logs);
    }
}
```

---

## ✅ 5. 补充说明

### 确保你有这些 import：

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.time.Instant;
```

---

### ResponseBody 示例类（如果你还没有）：

```java
public class ResponseBody {
    private String message;
    private Object data;

    public static ResponseEntity<ResponseBody> ok(String message, Object data) {
        ResponseBody body = new ResponseBody();
        body.message = message;
        body.data = data;
        return ResponseEntity.ok(body);
    }
}
```

---

以上就是完整无分页的原生查询 + DTO 返回。
需要我把 DTO 改成 class（非 interface）+ 构造函数方式也可以告诉我。

SELECT 
    logId,
    auditLevel,
    message,
    actionDate,
    applicationId
FROM 
    ActivityLog
WHERE 
    auditLevel IN (1, 2)
    AND applicationId = 123456  -- 👉 请替换为你要查询的实际 applicationId
ORDER BY 
    actionDate DESC;

public List<ActiveLogsDTO> findApplicationLogs() {
    List<Object[]> results = appInstanceRepository.findRawLogs();
    return results.stream().map(r -> new ActiveLogsDTO(
        ((BigInteger) r[0]).longValue(), // id
        (String) r[1],                   // module
        (String) r[2],                   // category
        (Integer) r[3],                  // auditLevel
        (String) r[4],                   // message
        ((Timestamp) r[5]).toInstant(),  // actionDate
        (String) r[6],                   // operatorStaffId
        (String) r[7],                   // operatorName
        ((BigInteger) r[8]).longValue(), // moduleId
        ((BigInteger) r[9]).longValue(), // applicationId
        ((BigInteger) r[10]).longValue() // serviceId
    )).collect(Collectors.toList());
}


