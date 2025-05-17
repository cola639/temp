@Query(value =
        "WITH lastestReport AS ( " +
        "    SELECT TOP 1 month, week " +
        "    FROM dbo.RemediationDetail " +
        "    ORDER BY month DESC, week DESC " +
        "), " +

        "AppNameServName AS ( " +
        "    SELECT DISTINCT CAST(applicationId AS BIGINT) AS applicationId, " +
        "           applicationName, itServiceId, itService " +
        "    FROM dbo.ItAppServiceHost " +
        "    WHERE CAST(itsoStaffId AS VARCHAR) = :staffId " +
        "       OR itsoDelegateStaffId = :staffId " +
        "), " +

        "violations AS ( " +
        "    SELECT " +
        "        detail.applicationId, " +
        "        detail.itServiceId, " +
        "        CAST(detail.isCritical AS INT) AS itacCritical, " +
        "        1 AS violations, " +
        "        IIF(dueDate < GETDATE(), 1, 0) AS overdue, " +
        "        IIF( " +
        "            (exceptions IS NOT NULL AND exceptions = 'Exception') " +
        "            OR (comments IS NOT NULL AND comments = 'Third party vendor dependency'), " +
        "            1, 0 " +
        "        ) AS exception, " +
        "        CAST(detail.assetCategory AS INT) AS assetCategory, " +
        "        CAST(detail.ibs AS INT) AS ibs, " +
        "        CAST(detail.criticalAsset AS INT) AS criticalAsset " +
        "    FROM dbo.RemediationDetail detail " +
        "    INNER JOIN lastestReport " +
        "        ON detail.month = lastestReport.month AND detail.week = lastestReport.week " +
        "    WHERE detail.applicationId IN ( " +
        "        SELECT CAST(applicationId AS BIGINT) " +
        "        FROM dbo.ItAppServiceHost " +
        "        WHERE CAST(itsoStaffId AS VARCHAR) = :staffId " +
        "            OR itsoDelegateStaffId = :staffId " +
        "    ) " +
        "), " +

        "stat AS ( " +
        "    SELECT applicationId, " +
        "           itServiceId, " +
        "           MAX(itacCritical) AS itacCritical, " +
        "           SUM(violations) AS violations, " +
        "           SUM(overdue) AS overdue, " +
        "           SUM(exception) AS exceptions, " +
        "           MAX(assetCategory) AS assetCategory, " +
        "           MAX(ibs) AS ibs, " +
        "           MAX(criticalAsset) AS criticalAsset " +
        "    FROM violations " +
        "    GROUP BY applicationId, itServiceId " +
        ") " +

        "SELECT u.applicationName, " +
        "       u.itService, " +
        "       u.applicationId, " +
        "       u.itServiceId, " +
        "       s.violations, s.overdue, s.exceptions, s.itacCritical, " +
        "       s.assetCategory, s.ibs, s.criticalAsset " +
        "FROM stat s " +
        "INNER JOIN AppNameServName u " +
        "    ON s.applicationId = u.applicationId AND s.itServiceId = u.itServiceId",
        nativeQuery = true)
List<AppInstanceDto> getAppInstance(@Param("staffId") String staffId);
