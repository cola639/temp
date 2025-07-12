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
