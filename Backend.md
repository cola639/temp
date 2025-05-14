根据你图片中的字段要求，我为你写好了一份标准的建表 SQL，表名为 `ViolationRemediationPlan`，字段包含日期、状态、文本等，**不包含 DROP 语句，安全可直接执行。**

---

## ✅ 建表 SQL（SQL Server 语法）

```sql
CREATE TABLE ViolationRemediationPlan (
    planId BIGINT PRIMARY KEY,              -- 主键
    hostname VARCHAR(255) NOT NULL,         -- 主机名
    checkId VARCHAR(100) NOT NULL,          -- 检查项ID
    checkName VARCHAR(255) NOT NULL,        -- 检查项名称
    remediationStatus VARCHAR(50) NOT NULL, -- 修复状态（如 Pending、Approved）
    remediationDate DATETIME NULL,          -- 修复完成时间
    contactUpdator VARCHAR(255) NULL,       -- 联系人/更新人
    updatedDate DATETIME NULL               -- 最后更新时间
);
```

---

### ✅ 字段说明：

| 字段名                 | 类型             | 说明                            |
| ------------------- | -------------- | ----------------------------- |
| `planId`            | `BIGINT`       | 主键（建议唯一，不自增可由业务生成）            |
| `hostname`          | `VARCHAR(255)` | 主机名                           |
| `checkId`           | `VARCHAR(100)` | 检查项 ID                        |
| `checkName`         | `VARCHAR(255)` | 检查项名称                         |
| `remediationStatus` | `VARCHAR(50)`  | 修复状态（如 `Pending`, `Approved`） |
| `remediationDate`   | `DATETIME`     | 修复完成时间，可空                     |
| `contactUpdator`    | `VARCHAR(255)` | 联系人（拼写已修正）                    |
| `updatedDate`       | `DATETIME`     | 最后更新时间，可空                     |

---

### ✅ 你下一步可以考虑：

* 加索引（如 `checkId`, `hostname`）
* 加约束（如 `remediationStatus` 使用枚举/代码表）
* 后续配合 Spring JPA 实体生成代码

需要我顺带帮你生成对应的 **JPA 实体类** 或 **insert 示例语句**吗？直接告诉我即可！
