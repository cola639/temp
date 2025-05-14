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
