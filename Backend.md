SELECT
  detail.applicationId,
  detail.itServiceId,
  CAST(detail.itacCritical AS INT) AS itacCritical,
  1 AS violations,
  IIF(dueDate < GETDATE(), 1, 0) AS overdue,
  IIF(
    EXISTS (
      SELECT 1 FROM dbo.ExceptionRequestViolation erv
      WHERE erv.id = detail.id
        AND erv.expiryDate > GETDATE()
    ),
    1, 0
  ) AS exception,
  CAST(detail.assetCategory AS INT) AS assetCategory,
  CAST(detail.ibs AS INT) AS ibs,
  CAST(detail.criticalAsset AS INT) AS criticalAsset
FROM dbo.RemediationDetail detail
-- 其他 join 和 where 保持不变
