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



