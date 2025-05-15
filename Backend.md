非常棒，你的目标是：

> **根据 SQL 查询结果，按 `applicationId` 分组分类，并封装为 `HostListDTO` 实体结构，返回给前端。**

我给你一个完整的流程实现，**包括 SQL 查询、DTO 映射、Java 分组转换。**

---

## ✅ 1. 你的 `HostListDTO` 已经准备好

字段齐全，比如：

```java
public class HostListDTO {
    private String hostName;
    private String tierCriticality;
    private Boolean itacCritical;
    private String environment;
    private String network;
    private String gbgf;
    private String gbgfFunction;
    private String gbgfSubFunction;
    private Long violations;
    private Long exception;
}
```

---

## ✅ 2. SQL 查询：查询所有记录（带 applicationId）

```sql
SELECT 
    applicationId,
    hostName,
    tierCriticality,
    CAST(itacCritical AS INT) AS itacCritical,
    environment,
    network,
    gbgf,
    gbgfFunction,
    gbgfSubFunction,
    1 AS violations,
    IIF(
        (exceptions IS NOT NULL AND exceptions = 'Exception') 
        OR (comments IS NOT NULL AND comments = 'Third party vendor dependency'), 
        1, 0
    ) AS exception
FROM dbo.RemediationDetail1
WHERE applicationId IN (:applicationIds) -- 可以是多个
```

---

## ✅ 3. Repository 中使用 DTO 投影接收结果（扁平结构）

```java
public interface HostRecordProjection {
    Long getApplicationId();
    String getHostName();
    String getTierCriticality();
    Boolean getItacCritical();
    String getEnvironment();
    String getNetwork();
    String getGbgf();
    String getGbgfFunction();
    String getGbgfSubFunction();
    Long getViolations();
    Long getException();
}
```

```java
@Query(value = "SELECT ...", nativeQuery = true)
List<HostRecordProjection> findHostRecordsByAppIds(@Param("applicationIds") List<Long> applicationIds);
```

---

## ✅ 4. Service 中按 `applicationId` 分组并转换为 `Map<Long, List<HostListDTO>>`

```java
public Map<Long, List<HostListDTO>> getHostListGroupedByAppId(List<Long> appIds) {
    List<HostRecordProjection> raw = repository.findHostRecordsByAppIds(appIds);

    return raw.stream()
        .map(r -> {
            HostListDTO dto = new HostListDTO();
            dto.setHostName(r.getHostName());
            dto.setTierCriticality(r.getTierCriticality());
            dto.setItacCritical(r.getItacCritical());
            dto.setEnvironment(r.getEnvironment());
            dto.setNetwork(r.getNetwork());
            dto.setGbgf(r.getGbgf());
            dto.setGbgfFunction(r.getGbgfFunction());
            dto.setGbgfSubFunction(r.getGbgfSubFunction());
            dto.setViolations(r.getViolations());
            dto.setException(r.getException());
            return new AbstractMap.SimpleEntry<>(r.getApplicationId(), dto);
        })
        .collect(Collectors.groupingBy(
            Map.Entry::getKey,
            Collectors.mapping(Map.Entry::getValue, Collectors.toList())
        ));
}
```

---

## ✅ 5. Controller 调用示例

```java
@GetMapping("/host-list")
public Map<Long, List<HostListDTO>> getGroupedHosts(@RequestParam List<Long> appIds) {
    return service.getHostListGroupedByAppId(appIds);
}
```

---

## ✅ 最终返回结果示例（按 applicationId 分组）

```json
{
  "10303024": [
    {
      "hostName": "host-a",
      "tierCriticality": "High",
      "itacCritical": true,
      ...
    },
    {
      "hostName": "host-b",
      ...
    }
  ],
  "10303025": [
    {
      "hostName": "host-c",
      ...
    }
  ]
}
```

---

## ✅ 小结

| 关键点    | 实现方式                         |
| ------ | ---------------------------- |
| 多字段查询  | 用 Projection                 |
| 多记录分组  | Java `Collectors.groupingBy` |
| 一行 DTO | 只用 `HostListDTO`             |
| 可扩展结构  | 未来可加分页、条件、导出                 |

---

需要我根据你真实字段帮你把 SQL 拼好和 Repository 接口补全吗？还是你要我把这段组装成 JPA 可直接跑的完整代码？随时可以补。


@Query(value = """
    SELECT 
        applicationId,
        hostname AS hostName,
        tierCriticality,
        CAST(itacCritical AS INT) AS itacCritical,
        environment,
        network,
        gbgf,
        gbgfFunction,
        gbgfSubFunction,
        1 AS violations,
        IIF(
            (exceptions IS NOT NULL AND exceptions = 'Exception') OR 
            (comments IS NOT NULL AND comments = 'Third party vendor dependency'),
            1, 0
        ) AS exception,
        IIF(dueDate < GETDATE(), 1, 0) AS overdue  -- ✅ 新增字段
    FROM dbo.RemediationDetail1
    WHERE applicationId = :applicationId
    """, nativeQuery = true)
List<HostRecordProjection> findHostRecordsByAppId(@Param("applicationId") Long applicationId);

@Query(value =
    "SELECT " +
    "    hostname AS hostName, " +
    "    tierCriticality, " +
    "    CAST(itacCritical AS INT) AS itacCritical, " +
    "    environment, " +
    "    network, " +
    "    gbgf, " +
    "    gbgfFunction, " +
    "    gbgfSubFunction, " +
    "    1 AS violations, " +
    "    IIF( " +
    "        (exceptions IS NOT NULL AND exceptions = 'Exception') OR " +
    "        (comments IS NOT NULL AND comments = 'Third party vendor dependency'), " +
    "        1, 0 " +
    "    ) AS exception, " +
    "    IIF(dueDate < GETDATE(), 1, 0) AS overdue " +
    "FROM dbo.RemediationDetail1 " +
    "WHERE applicationId = :applicationId",
    nativeQuery = true)
List<HostRecordProjection> findHostRecordsByAppId(@Param("applicationId") Long applicationId);




@Query(value =
    "SELECT " +
    "    hostname AS hostName, " +
    "    tierCriticality, " +
    "    CAST(itacCritical AS INT) AS itacCritical, " +
    "    environment, " +
    "    network, " +
    "    gbgf, " +
    "    gbgfFunction, " +
    "    gbgfSubFunction, " +
    "    1 AS violations, " +
    "    IIF( " +
    "        (exceptions IS NOT NULL AND exceptions = 'Exception') OR " +
    "        (comments IS NOT NULL AND comments = 'Third party vendor dependency'), " +
    "        1, 0 " +
    "    ) AS exception, " +
    "    IIF(dueDate < GETDATE(), 1, 0) AS overdue " +
    "FROM dbo.RemediationDetail1 " +
    "WHERE applicationId = :applicationId",
    nativeQuery = true)
List<HostRecordProjection> findHostRecordsByAppId(@Param("applicationId") Long applicationId);

@Query(value =
    "SELECT " +
    "    hostname AS hostName, " +
    "    tierCriticality, " +
    "    CAST(itacCritical AS INT) AS itacCritical, " +
    "    environment, " +
    "    network, " +
    "    gbgf, " +
    "    gbgfFunction, " +
    "    gbgfSubFunction, " +
    "    1 AS violations, " +
    "    IIF( " +
    "        (exceptions IS NOT NULL AND exceptions = 'Exception') OR " +
    "        (comments IS NOT NULL AND comments = 'Third party vendor dependency'), " +
    "        1, 0 " +
    "    ) AS exception, " +
    "    IIF(dueDate < GETDATE(), 1, 0) AS overdue " +
    "FROM dbo.RemediationDetail1 " +
    "WHERE applicationId = :applicationId",
    nativeQuery = true)
List<HostListDTO> findHostRecordsByAppId(@Param("applicationId") Long applicationId);


很好的问题，你想要实现的是：

---

## ✅ 目标：DTO 中嵌套 `List<HostStatusList>` 子列表

```java
public class HostListDTO {
    private String hostName;
    ...
    private List<HostStatusList> hostStatusList; // 🔁 嵌套结构
}
```

其中 `HostStatusList` 是来自另一个表，比如 `StatusList`，通过 `hostName` 进行关联查询。

---

## ✅ 实现方式建议（标准 Java + JPA 方案）：

> 先查出主表 `RemediationDetail1` → 映射为 `HostListDTO`
> 再根据每个 `hostName` 去查 `StatusList` 表 → 映射为 `HostStatusList`
> 最终封装成：一个 HostListDTO 中包含多个 HostStatusList

---

## ✅ 步骤一：定义嵌套 DTO 类

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HostStatusList {
    private String statusCode;
    private String statusDesc;
    private LocalDateTime createdTime;
}
```

---

## ✅ 步骤二：修改 HostListDTO 加上子列表字段

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HostListDTO {
    private String hostName;
    private String tierCriticality;
    private Boolean itacCritical;
    private String environment;
    private String network;
    private String gbgf;
    private String gbgfFunction;
    private String gbgfSubFunction;
    private Long violations;
    private Long exception;
    private Long overdue;

    private List<HostStatusList> hostStatusList; // ✅ 嵌套子列表
}
```

---

## ✅ 步骤三：Repository 添加 StatusList 查询方法

```java
@Query("SELECT new com.yourpackage.dto.HostStatusList(s.statusCode, s.statusDesc, s.createdTime) " +
       "FROM StatusListEntity s WHERE s.hostName = :hostName")
List<HostStatusList> findStatusByHostName(@Param("hostName") String hostName);
```

---

## ✅ 步骤四：Service 组装逻辑

```java
@Autowired
private RemediationDetailRepository detailRepo;

@Autowired
private StatusListRepository statusRepo;

public List<HostListDTO> getHostListWithStatus(Long applicationId) {
    List<HostRecordProjection> rawList = detailRepo.findHostRecordsByAppId(applicationId);

    return rawList.stream()
        .map(r -> {
            HostListDTO dto = new HostListDTO();
            dto.setHostName(r.getHostName());
            dto.setTierCriticality(r.getTierCriticality());
            dto.setItacCritical(r.getItacCritical());
            dto.setEnvironment(r.getEnvironment());
            dto.setNetwork(r.getNetwork());
            dto.setGbgf(r.getGbgf());
            dto.setGbgfFunction(r.getGbgfFunction());
            dto.setGbgfSubFunction(r.getGbgfSubFunction());
            dto.setViolations(r.getViolations());
            dto.setException(r.getException());
            dto.setOverdue(r.getOverdue());

            // 🔁 通过 hostName 查询 status 列表
            List<HostStatusList> statusList = statusRepo.findStatusByHostName(r.getHostName());
            dto.setHostStatusList(statusList);

            return dto;
        })
        .collect(Collectors.toList());
}
```

---

## ✅ 最终返回结构（JSON）

```json
[
  {
    "hostName": "host-a",
    "tierCriticality": "High",
    "itacCritical": true,
    "overdue": 1,
    ...
    "hostStatusList": [
      { "statusCode": "PENDING", "statusDesc": "Pending Approval", "createdTime": "2024-01-01T10:00:00" },
      { "statusCode": "FAILED", "statusDesc": "Validation Failed", "createdTime": "2024-01-02T14:00:00" }
    ]
  },
  ...
]
```

---

## ✅ 小结

| 你要实现的              | 我给出的方式                 |
| ------------------ | ---------------------- |
| DTO 嵌套子列表          | `List<HostStatusList>` |
| 多表连接逻辑             | 用 Java 分两步查            |
| 根据 `hostName` 组装子表 | 用 Repository 方法查       |
| 保持结构清晰、灵活拓展        | ✅ 推荐实践方式               |

---

如果你希望进一步优化为 **单 SQL 查询联表查出 + ResultTransformer 转 DTO** 也可以，但对可读性和维护性不友好。你现在这种是 ✅ 最可控、清晰、安全的做法。

是否需要我帮你把这个 status 表建表 SQL 或实体类也补上？或者希望做分页结构？随时告诉我。




