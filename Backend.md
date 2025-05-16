你现在的需求非常明确 ✅：

---

## ✅ 目标：

将一个 `List<HostItem>` 的数据：

* **按 `hostname` 分组**
* 每个 `hostname` 分组下：

  * 拿出 **每条记录共同的字段**（network、platform、环境等）抽取出来放最外层
  * 剩下的记录按 `violation == true` 和 `exception == true` 再拆成：

    * `violationList`
    * `exceptionList`

---

## ✅ 一、DTO 结构设计（Java）

### 🔹 原始项 DTO（HostItemDTO）

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostItemDTO {
    private String hostname;
    private String network;
    private String checkId;
    private String checkName;
    private boolean violation;
    private boolean exception;
    private String platform;
    private String environment;
    // 你可以加其他字段
}
```

---

### 🔹 分组后的结构 DTO（HostGroupDTO）

```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class HostGroupDTO {
    private String hostname;
    private String network;
    private String platform;
    private String environment;
    private List<HostItemDTO> violationList = new ArrayList<>();
    private List<HostItemDTO> exceptionList = new ArrayList<>();
}
```

---

## ✅ 二、Java 代码实现（Java 8 写法）

```java
public List<HostGroupDTO> transform(List<HostItemDTO> hostList) {
    // 用 Map<hostname, HostGroupDTO> 来分组
    Map<String, HostGroupDTO> groupMap = new LinkedHashMap<>();

    for (HostItemDTO item : hostList) {
        String key = item.getHostname();

        HostGroupDTO group = groupMap.computeIfAbsent(key, k -> {
            HostGroupDTO g = new HostGroupDTO();
            g.setHostname(item.getHostname());
            g.setNetwork(item.getNetwork());
            g.setPlatform(item.getPlatform());
            g.setEnvironment(item.getEnvironment());
            return g;
        });

        if (item.isViolation()) {
            group.getViolationList().add(item);
        }

        if (item.isException()) {
            group.getExceptionList().add(item);
        }
    }

    return new ArrayList<>(groupMap.values());
}
```

---

## ✅ 使用示例

```java
List<HostItemDTO> inputList = Arrays.asList(
    new HostItemDTO("123", "wifi", "123", "check123", true, false, "Linux", "Prod"),
    new HostItemDTO("234", "wifi2", "1234", "check234", false, true, "Windows", "UAT"),
    new HostItemDTO("123", "wifi", "12345", "check12345", false, true, "Linux", "Prod"),
    new HostItemDTO("234", "wifi2", "123456", "check23456", true, true, "Windows", "UAT")
);

List<HostGroupDTO> finalList = transform(inputList);
```

---

## ✅ 输出结构预期

```json
[
  {
    "hostname": "123",
    "network": "wifi",
    "platform": "Linux",
    "environment": "Prod",
    "violationList": [ { ... checkId: "123" } ],
    "exceptionList": [ { ... checkId: "12345" } ]
  },
  {
    "hostname": "234",
    "network": "wifi2",
    "platform": "Windows",
    "environment": "UAT",
    "violationList": [ { ... checkId: "123456" } ],
    "exceptionList": [ { ... checkId: "1234" }, { ... checkId: "123456" } ]
  }
]
```

---

## ✅ 优点

* 公共字段放外层，避免重复传输
* 子表格清晰拆分
* 非常适合前端 `expandTable` 结构使用

---

如果你还希望统计每组 violation 数量、按 dueDate 排序等，也可以继续扩展。是否需要加？我可以继续补上。

Optional.ofNullable(hostViolationStatus).ifPresent(status -> {
    item.setRemediationStatus(status.getRemediationStatus());
    item.setRemediationDate(status.getRemediationDate());
});



