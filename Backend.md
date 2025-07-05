WITH lastMonthWeek AS (
    SELECT TOP 1 month, week
    FROM RemediationDetail
    ORDER BY month DESC, week DESC
)
SELECT *,
       DATEDIFF(DAY, GETDATE(), dueDate) AS comingDueDays
FROM RemediationDetail
WHERE month = (SELECT month FROM lastMonthWeek)
  AND week = (SELECT week FROM lastMonthWeek)
  AND (exceptions IS NULL OR exceptions != 'Exception')
  AND (comments IS NULL OR comments != 'Third Party Vendor Dependency')
  AND DATEDIFF(DAY, GETDATE(), dueDate) IN (30, 60, 90);


2 

WITH lastMonthWeek AS (
    SELECT TOP 1 month, week
    FROM RemediationDetail
    ORDER BY month DESC, week DESC
)
SELECT * FROM RemediationDetail
WHERE month = :month
  AND week = :week
  AND (exceptions IS NULL OR exceptions != 'Exception')
  AND (comments IS NULL OR comments != 'Third Party Vendor Dependency')
  AND dueDate > GETDATE()
ORDER BY platform, IIf(hostname IS NULL, 1, 1), hostname, applicationId


WITH lastMonthWeek AS (
  SELECT TOP 1 month, week 
  FROM RemediationDetail 
  ORDER BY month DESC, week DESC
)
SELECT *, DATEDIFF(DAY, GETDATE(), dueDate) AS comingDueDays
FROM RemediationDetail
WHERE month = (SELECT month FROM lastMonthWeek)
  AND week = (SELECT week FROM lastMonthWeek)
  AND (exceptions IS NULL OR exceptions != 'Exception')
  AND (comments IS NULL OR comments != 'Third Party Vendor Dependency')
  AND dueDate > GETDATE()

