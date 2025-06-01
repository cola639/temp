-- Declare input parameters
DECLARE @month INT = 6;
DECLARE @latestWeek INT = 23;

-- Use parameters in SQL
SELECT platform, MONTH, week, SUM(high) AS high, SUM(medium) AS medium, SUM(low) AS low
FROM (
    SELECT 
        platform,
        month,
        week,
        IIF(risk = 'High', 1, 0) AS high,
        IIF(risk = 'Medium', 1, 0) AS medium,
        IIF(risk = 'Low', 1, 0) AS low
    FROM RemediationDetail detail
    WHERE detail.id NOT IN (
        SELECT id 
        FROM dbo.ExceptionRequestViolation 
        WHERE status = 'Approved' 
          AND expiryDate > GETDATE()
    )
    AND platform NOT IN ('Windows', 'Unix', 'Data Platform', 'HIP')
    AND month = @month
    AND week = @latestWeek
) t
GROUP BY platform, MONTH, week;
