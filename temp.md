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