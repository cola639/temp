好的！你在图片里的 SQL 查询是：

```sql
SELECT * 
FROM dbo.RemediationDetail 
WHERE month = 202505 
  AND week = 2 
  AND applicationId IN (
    SELECT applicationId 
    FROM dbo.ItsoAppService 
    WHERE staffId = ?
  );
```

------

### ✅ 对应的 Spring Data JPA 查询

你需要在 AppInstanceRepository 接口中写一个自定义查询方法，用 @Query 注解。

------

### 示例代码

```java
@Repository
public interface AppInstanceRepository extends JpaRepository<AppInstance, Long> {

    @Query("SELECT a FROM AppInstance a " +
           "WHERE a.month = :month " +
           "AND a.week = :week " +
           "AND a.appInstID IN (" +
           "   SELECT i.applicationId FROM ItsoAppService i WHERE i.staffId = :staffId" +
           ")")
    List<AppInstance> findByMonthWeekAndStaff(@Param("month") Integer month,
                                              @Param("week") Integer week,
                                              @Param("staffId") Long staffId);
}
```

------

### ⚠ 注意事项

✅ 上面的 `ItsoAppService` 需要有对应的实体类（JPA 里不能直接用表名，必须是实体名）。
 ✅ 确保 `appInstID` 在 AppInstance 类里对应的是 `applicationId`。
 ✅ 确保字段命名（`month`, `week`, `staffId`）和实体类字段一致，或用 @Column 指定。

------

### ✅ 如果你需要原生 SQL（因为涉及复杂表）

可以写：

```java
@Repository
public interface AppInstanceRepository extends JpaRepository<AppInstance, Long> {

    @Query(value = "SELECT * FROM RemediationDetail " +
                   "WHERE month = :month " +
                   "AND week = :week " +
                   "AND applicationId IN (" +
                   "   SELECT applicationId FROM ItsoAppService WHERE staffId = :staffId" +
                   ")", nativeQuery = true)
    List<AppInstance> findByMonthWeekAndStaff(@Param("month") Integer month,
                                              @Param("week") Integer week,
                                              @Param("staffId") Long staffId);
}
```

✅ 这里用 nativeQuery = true，允许你直接写数据库 SQL。

------

如果你还需要帮忙生成 ItsoAppService 实体或者写 Service、Controller 层的调用代码，直接跟我说，我可以帮你全套生成好！需要吗？


好的！我来帮你生成对应的 **Service 层** 和 **Controller 层**，配合你这个 AppInstanceRepository 接口。

------

### ✅ AppInstanceService

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppInstanceService {

    @Autowired
    private AppInstanceRepository appInstanceRepository;

    public List<AppInstance> getAppInstances(Integer month, Integer week, Long staffId) {
        return appInstanceRepository.findByMonthWeekAndStaff(month, week, staffId);
    }
}
```

------

### ✅ AppInstanceController

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-instances")
public class AppInstanceController {

    @Autowired
    private AppInstanceService appInstanceService;

    @GetMapping("/search")
    public List<AppInstance> getAppInstances(@RequestParam Integer month,
                                             @RequestParam Integer week,
                                             @RequestParam Long staffId) {
        return appInstanceService.getAppInstances(month, week, staffId);
    }
}
```

------

### ✅ 接口调用方式

请求示例（GET 请求）：

```
GET /api/app-instances/search?month=202505&week=2&staffId=12345
```

它会返回符合条件的 AppInstance 列表，序列化为 JSON。

------

### ⚠ 注意

✅ 如果你用的是 Spring Boot + Jackson，默认会自动把 `AppInstance` 序列化为 JSON。
 ✅ 如果你只想返回部分字段（避免暴露数据库结构），建议引入 DTO：
 我可以帮你写一个 `AppInstanceDTO`，然后用 `MapStruct` 或手动转换。

------

要不要我帮你写：
 ✅ DTO 封装版本
 ✅ 分页查询（Pageable）版本
 ✅ 或者加上统一响应封装（如 `Result<T>`、状态码、消息）

需要的话直接说！我可以直接帮你写好一整套。

好的！你要的是：

✅ 不再用 month 和 week 过滤，而是：
 默认查询从今天起，往前倒推 15 天的数据。

------

### ✅ 改造方案

1️⃣ 让 Controller 接收 `staffId`，其他时间范围由后端自动计算。

2️⃣ 在 Repository 中写基于日期的查询。

------

### ✅ Controller 改造

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/app-instances")
public class AppInstanceController {

    @Autowired
    private AppInstanceService appInstanceService;

    @GetMapping("/search")
    public List<AppInstance> getAppInstances(@RequestParam Long staffId) {
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(15);

        return appInstanceService.getAppInstancesByDateRange(startDate, endDate, staffId);
    }
}
```

------

### ✅ Service 改造

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AppInstanceService {

    @Autowired
    private AppInstanceRepository appInstanceRepository;

    public List<AppInstance> getAppInstancesByDateRange(LocalDate startDate, LocalDate endDate, Long staffId) {
        return appInstanceRepository.findByDateRangeAndStaff(startDate, endDate, staffId);
    }
}
```

------

### ✅ Repository 改造（假设用 dueDate 字段）

```java
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AppInstanceRepository extends JpaRepository<AppInstance, Long> {

    @Query(value = "SELECT * FROM RemediationDetail " +
                   "WHERE dueDate BETWEEN :startDate AND :endDate " +
                   "AND applicationId IN (" +
                   "   SELECT applicationId FROM ItsoAppService WHERE staffId = :staffId" +
                   ")", nativeQuery = true)
    List<AppInstance> findByDateRangeAndStaff(@Param("startDate") LocalDate startDate,
                                              @Param("endDate") LocalDate endDate,
                                              @Param("staffId") Long staffId);
}
```

------

### ✅ 注意

✔ 数据库字段 `dueDate` 必须是 datetime/date 类型，且存的时间格式和 Java LocalDate 匹配。
 ✔ 如果你要用其他字段（比如 LastCompliantDate），只要改 SQL 里对应字段。
 ✔ 如果数据库用 datetime2，Java 传入 LocalDate 是 OK 的，底层驱动会自动转换。

------

如果你需要：
 ✅ 结果分页（Pageable）
 ✅ DTO 映射（只返回部分字段）
 ✅ 错误处理和统一响应结构

直接说，我可以帮你全套写好！要吗？