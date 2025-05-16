    "WHERE applicationId = :applicationId " +
    "AND hostname IS NOT NULL " +
    "AND EXISTS ( " +
    "    SELECT 1 FROM ( " +
    "        SELECT TOP 1 month, week " +
    "        FROM dbo.RemediationDetail " +
    "        ORDER BY month DESC, week DESC " +
    "    ) AS latest " +
    "    WHERE latest.month = RemediationDetail.month " +
    "      AND latest.week = RemediationDetail.week " +
    ")"
