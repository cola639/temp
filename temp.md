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