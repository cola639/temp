SELECT * FROM (
    SELECT *, ROW_NUMBER() OVER (PARTITION BY platform, configurationShortName ORDER BY recordId) RN
    FROM Kci5Details
    WHERE month = 202505
      AND (controlCheckStatus IS NULL OR controlCheckStatus != 'Active')
) T
WHERE RN = 1;
