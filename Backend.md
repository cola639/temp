    @Query(value = """
        WITH lastestReport AS (
            SELECT TOP 1 month, week 
            FROM dbo.RemediationDetail 
            ORDER BY month DESC, week DESC
        ),
        appNameSerName AS (
            SELECT DISTINCT CAST(applicationId AS BIGINT) AS applicationId,
                   applicationName, itServiceId, itService
            FROM dbo.ItsoAppServiceHost
            WHERE CAST(itsoStaffId AS VARCHAR) = :staffId
               OR itsoDelegateStaffId = :staffId
        ),
        violations AS (
            SELECT detail.applicationId,
                   detail.itServiceId,
                   CAST(detail.itacCritical AS INT) AS itacCritical, -- ✅ 转换 BIT → INT
                   1 AS violations,
                   IIF(dueDate < GETDATE(), 1, 0) AS overdue,
                   IIF(
                       (exceptions IS NOT NULL AND exceptions = 'Exception')
                       OR (comments IS NOT NULL AND comments = 'Third party vendor dependency'),
                       1, 0
                   ) AS exception
            FROM dbo.RemediationDetail detail
            INNER JOIN lastestReport 
                ON detail.month = lastestReport.month AND detail.week = lastestReport.week
            WHERE detail.applicationId IN (
                SELECT CAST(applicationId AS BIGINT)
                FROM dbo.ItsoAppServiceHost
                WHERE CAST(itsoStaffId AS VARCHAR) = :staffId
                   OR itsoDelegateStaffId = :staffId
            )
        ),
        stat AS (
            SELECT applicationId,
                   itServiceId,
                   MAX(itacCritical) AS itacCritical, -- ✅ 聚合 int
                   SUM(violations) AS violations,
                   SUM(overdue) AS overdue,
                   SUM(exception) AS exceptions
            FROM violations
            GROUP BY applicationId, itServiceId
        )
        SELECT u.applicationName,
               u.itService,
               s.applicationId,
               s.itServiceId,
               s.violations,
               s.overdue,
               s.exceptions,
               s.itacCritical
        FROM stat s
        INNER JOIN appNameSerName u 
            ON s.applicationId = u.applicationId AND s.itServiceId = u.itServiceId
        """, nativeQuery = true)
