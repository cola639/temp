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

好的！下面我将按照 **Spring Boot 三层架构最佳实践**，为你重写这个功能：

> 按 `appId` 查询所有数据，然后按 `appName` 分组，最终返回结构化 JSON。

---

## 🧱 假设数据库表结构如下（`table_name`）：

| id | appId | appName     | user  | access\_time     |
| -- | ----- | ----------- | ----- | ---------------- |
| 1  | xxx   | ChatGPT     | alice | 2024-01-01 10:00 |
| 2  | xxx   | ChatGPT     | bob   | 2024-01-01 11:00 |
| 3  | xxx   | ChatGPT PRO | alice | 2024-01-02 09:00 |

---

## ✅ 一、DTO 类定义

```java
// App 信息
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppInfoDTO {
    private String appId;
    private String appName;
}

// 用户访问明细
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDTO {
    private Long id;
    private String user;
    private LocalDateTime accessTime;
}

// 分组结构
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppGroupDTO {
    private AppInfoDTO appInfo;
    private List<UserInfoDTO> userInfo;
}
```

---

## ✅ 二、Repository 层

```java
@Repository
public interface AppAccessRepository extends JpaRepository<AppAccessEntity, Long> {
    List<AppAccessEntity> findByAppId(String appId);
}
```

假设你已有一个实体类 `AppAccessEntity` 对应表 `table_name`。

---

## ✅ 三、Service 层

```java
@Service
public class AppAccessService {

    @Autowired
    private AppAccessRepository repository;

    public List<AppGroupDTO> getGroupedData(String appId) {
        List<AppAccessEntity> rawData = repository.findByAppId(appId);

        // 按 appId + appName 分组
        return rawData.stream()
            .collect(Collectors.groupingBy(
                e -> new AppInfoDTO(e.getAppId(), e.getAppName()),
                LinkedHashMap::new,
                Collectors.mapping(
                    e -> new UserInfoDTO(e.getId(), e.getUser(), e.getAccessTime()),
                    Collectors.toList()
                )
            ))
            .entrySet().stream()
            .map(entry -> new AppGroupDTO(entry.getKey(), entry.getValue()))
            .collect(Collectors.toList());
    }
}
```

---

## ✅ 四、Controller 层

```java
@RestController
@RequestMapping("/apps")
public class AppAccessController {

    @Autowired
    private AppAccessService appAccessService;

    @GetMapping("/grouped")
    public List<AppGroupDTO> getGroupedData(@RequestParam String appId) {
        return appAccessService.getGroupedData(appId);
    }
}
```

---

## ✅ 五、最终前端得到的 JSON 示例：

```json
[
  {
    "appInfo": {
      "appId": "xxx",
      "appName": "ChatGPT"
    },
    "userInfo": [
      { "id": 1, "user": "alice", "accessTime": "2024-01-01T10:00:00" },
      { "id": 2, "user": "bob", "accessTime": "2024-01-01T11:00:00" }
    ]
  },
  {
    "appInfo": {
      "appId": "xxx",
      "appName": "ChatGPT PRO"
    },
    "userInfo": [
      { "id": 3, "user": "alice", "accessTime": "2024-01-02T09:00:00" }
    ]
  }
]
```

---

## ✅ 小结

| 层级           | 职责           |
| ------------ | ------------ |
| `Controller` | 负责接收请求，调用服务层 |
| `Service`    | 封装聚合、分组逻辑    |
| `Repository` | 提供原始数据查询方法   |

---

