// connectiv
SELECT DISTINCT 
    f.[rule],
    f.risk AS riskRating,
    f.network,
    f.deviceFamily,
    f.domain,
    f.country,
    f.nameRule,
    f.name,
    f.dueDate,
    p.remediationStatus,
    p.remediationDate
FROM ConnectivityFail f
LEFT JOIN ViolationRemediationPlan p
    ON f.id = p.id 
    AND f.deviceFamily = p.deviceFamily
WHERE f.month = 202407;   -- 把202407替换为你实际要查的月份

// cwd
SELECT 
    'DRN' AS network, 
    rating.risk AS riskRating, 
    fail.netbiosName AS hostName, 
    fail.settingName, 
    DATEDIFF(DAY, lastComplianceMessageTime, '2024-07-11') AS overdueAge
FROM dbo.CwdFailedCheck fail
INNER JOIN dbo.CwdCheckRating rating ON fail.settingName = rating.settingName
INNER JOIN dbo.SlaThresholds thr ON thr.risk = rating.risk
WHERE rating.risk IN ('Medium', 'High')
  AND thr.network = 'DRN'
  AND DATEDIFF(DAY, lastComplianceMessageTime, '2024-07-11') > thr.sla
  AND fail.month = 202407

SELECT 
    'DRN' AS network, 
    iSer.risk AS riskRating,
    policyGrade,
    item,
    itemKey,
    valuea,
    enterpriseSystemName,
    systemVm,
    labeledRiskRating,
    DATEDIFF(DAY, iSer.localDate, :reportedDate) AS overdueAge
FROM dbo.ISeries iSer
INNER JOIN dbo.SlaThresholds thr ON 'DRN' = thr.network AND iSer.risk = thr.risk
WHERE 
    policyGrade IN (3)
    AND DATEDIFF(DAY, iSer.localDate, :reportedDate) > thr.sla
    AND iSer.month = :month;

    SELECT 
    *, 
    'DRN' AS network, 
    risk, 
    risk AS riskRating
FROM MainFrame
WHERE 
    findings + errors > 0
    AND month = :month
;


WITH pass AS (
    SELECT 
        'DRN' AS network,
        rating.risk,
        SUM(checks) AS pass
    FROM dbo.SsdAllChecks allCh
    LEFT JOIN dbo.SsdCheckRating rating ON allCh.settingName = rating.settingName
    WHERE 
        rating.risk IN ('Medium', 'High')
        AND allCh.severity = 'Compliant'
        AND allCh.month = :month
    GROUP BY rating.risk
),
fail AS (
    SELECT 
        thr.network, 
        rating.risk, 
        COUNT(1) AS fail
    FROM dbo.SsdFailedCheck fail
    INNER JOIN dbo.SsdCheckRating rating ON fail.settingName = rating.settingName
    INNER JOIN dbo.SlaThresholds thr ON thr.risk = rating.risk
    WHERE 
        rating.risk IN ('Medium', 'High')
        AND thr.network = 'DRN'
        AND DATEDIFF(DAY, lastComplianceMessageTime, :reportedDate) > thr.sla
        AND fail.month = :month
    GROUP BY rating.risk, thr.network
)
SELECT 
    pass.risk, 
    pass.network, 
    pass.pass, 
    NULL AS fail, 
    fail.fail 
FROM pass
FULL OUTER JOIN fail ON pass.risk = fail.risk AND pass.network = fail.network
;


SELECT 
    vm.*, 
    vm.risk AS riskRating,
    DATEDIFF(DAY, vm.violationOccurredDate, :reportedDate) AS overdueAge
FROM VmWare vm
INNER JOIN dbo.SlaThresholds thr 
    ON vm.risk = thr.risk AND vm.network = thr.network
WHERE 
    month = :month
    AND DATEDIFF(DAY, vm.violationOccurredDate, :reportedDate) > thr.sla
;


SELECT 
    *, 
    'DRN' AS network, 
    risk, 
    risk AS riskRating
FROM Mobile
WHERE 
    violationType = 'Red'
    AND policyDeviceCount > 0
    AND month = :month
;

| 参数名             | 说明                 | 示例值            |
| --------------- | ------------------ | -------------- |
| `:reportedDate` | 报告截止日期（字符串或date类型） | `'2024-07-11'` |
| `:month`        | 查询月份（数字型，格式yyyymm） | `202407`       |

SELECT 
    'DRN' AS network, 
    rating.risk AS riskRating, 
    fail.netbiosName AS hostName, 
    fail.settingName, 
    DATEDIFF(DAY, lastComplianceMessageTime, :reportedDate) AS overdueAge
FROM dbo.CwdFailedCheck fail
INNER JOIN dbo.CwdCheckRating rating ON fail.settingName = rating.settingName
INNER JOIN dbo.SlaThresholds thr ON thr.risk = rating.risk
WHERE rating.risk IN ('Medium', 'High')
  AND thr.network = 'DRN'
  AND DATEDIFF(DAY, lastComplianceMessageTime, :reportedDate) > thr.sla
  AND fail.month = :month
;



  

