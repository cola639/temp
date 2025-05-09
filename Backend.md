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



SELECT * 
FROM RemediationDetail
WHERE dueDate BETWEEN DATEADD(DAY, -15, CAST(GETDATE() AS DATE)) AND CAST(GETDATE() AS DATE);





好问题！你在 Microsoft SQL Server 上运行：

```sql
SELECT * 
FROM RemediationDetail
WHERE dueDate BETWEEN DATEADD(DAY, -15, CAST(GETDATE() AS DATE)) AND CAST(GETDATE() AS DATE);
```

查询出 6000 条数据，耗时超过 10 秒，确实太慢了。
 我给你分析 **常见优化点** 和 **针对性建议**。

------

### ✅ 优化方向 1：加索引

最重要也是最常见的优化：

👉 **确认 `dueDate` 字段上是否有索引**。
 因为你在 WHERE 子句里用 `dueDate` 做范围筛选，如果 `dueDate` 没有索引，SQL Server 每次都要全表扫描。

#### SQL 检查当前索引：

```sql
EXEC sp_helpindex 'RemediationDetail';
```

#### 如果没有索引，可以加：

```sql
CREATE INDEX idx_dueDate ON RemediationDetail(dueDate);
```

⚠ 注意：

- 如果表非常大（几十万、百万行以上），加索引会明显提速。
- 如果还有 `applicationId`、`staffId` 这种组合查询，可以考虑联合索引。

------

### ✅ 优化方向 2: 只查需要的列

你现在用的是：

```sql
SELECT *
```

它会查出表里的所有列（包括可能很大的文本、JSON、BLOB 列）。
 建议改成：

```sql
SELECT recordId, dueDate, applicationName, ... 
FROM RemediationDetail
WHERE dueDate BETWEEN DATEADD(DAY, -15, CAST(GETDATE() AS DATE)) AND CAST(GETDATE() AS DATE);
```

只查你实际要用到的列，可以减少：
 ✅ 网络传输
 ✅ 内存加载
 ✅ IO 压力

------

### ✅ 优化方向 3: 加分页

如果你只是要展示部分数据（如前端分页用），强烈建议加分页：

```sql
SELECT recordId, dueDate, applicationName, ...
FROM RemediationDetail
WHERE dueDate BETWEEN DATEADD(DAY, -15, CAST(GETDATE() AS DATE)) AND CAST(GETDATE() AS DATE)
ORDER BY dueDate DESC
OFFSET 0 ROWS FETCH NEXT 100 ROWS ONLY;
```

这样一次只取 100 条，大大减轻压力。

------

### ✅ 优化方向 4: 检查表统计信息和重建索引

如果你的表本身已经很大，过去有频繁写入或更新：

- 更新统计信息：

```sql
UPDATE STATISTICS RemediationDetail;
```

- 重建索引：

```sql
ALTER INDEX ALL ON RemediationDetail REBUILD;
```

这些可以帮助 SQL Server 优化执行计划。

------

### 🧠 总结优化建议

| 优化点                       | 是否推荐               |
| ---------------------------- | ---------------------- |
| 给 `dueDate` 加单列索引      | ✅ 强烈推荐             |
| 改 `SELECT *` 为具体列       | ✅ 强烈推荐             |
| 加分页 LIMIT（OFFSET FETCH） | ✅ 推荐（如果前端分页） |
| 更新统计信息/重建索引        | ✅ 推荐（表大时）       |

------

如果你愿意，可以把：
 ✅ 表结构（字段、主键、现有索引）
 ✅ 实际要展示的列
 贴给我，我帮你写更精准的优化 SQL！需要吗？直接贴上来吧。



好的！我来帮你写好完整的：

✅ Repository
 ✅ Service
 ✅ Controller

查询：

- 根据 `applicationName`（模糊匹配或完全匹配）
- `dueDate` 在 **今天到未来 15 天内**
- `overdue` 字段满足条件（这里我假设你要用 `overdue > 0`，如果有具体值可以改）

------

### ✅ Repository

```java
@Repository
public interface AppInstanceRepository extends JpaRepository<AppInstance, Long> {

    @Query(value = "SELECT * FROM RemediationDetail " +
                   "WHERE applicationName = :appName " +
                   "AND dueDate BETWEEN CAST(GETDATE() AS DATE) AND DATEADD(DAY, 15, CAST(GETDATE() AS DATE)) " +
                   "AND overdue > 0",
           nativeQuery = true)
    List<AppInstance> findUpcomingByApplicationName(@Param("appName") String appName);
}
```

------

### ✅ Service

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppInstanceService {

    @Autowired
    private AppInstanceRepository appInstanceRepository;

    public List<AppInstance> getUpcomingByApplicationName(String appName) {
        return appInstanceRepository.findUpcomingByApplicationName(appName);
    }
}
```

------

### ✅ Controller

```java
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app-instances")
public class AppInstanceController {

    @Autowired
    private AppInstanceService appInstanceService;

    @GetMapping("/upcoming")
    public List<AppInstance> getUpcomingByApplicationName(@RequestParam String appName) {
        return appInstanceService.getUpcomingByApplicationName(appName);
    }
}
```

请求示例：

```
GET /api/app-instances/upcoming?appName=MyApp
```

------

### ✅ 注意

- 如果 `applicationName` 需要模糊匹配（like %xxx%），需要把 Repository 改为：

```sql
WHERE applicationName LIKE %:appName%
```

- 如果 overdue 不用大于 0，而是用其他条件，可以直接修改 SQL。
- 如果未来需要分页（如前端表格加载），我也可以帮你加 `Pageable` 版本。

------

要我帮你写分页版、DTO 版或者多条件查询版吗？直接说！我帮你扩展好。