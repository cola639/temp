"IIF( " +
"    ( " +
"        (exceptions IS NOT NULL AND exceptions = 'Exception') " +
"        OR (comments IS NOT NULL AND comments = 'Third party vendor dependency') " +
"    ) " +
"    AND EXISTS ( " +
"        SELECT 1 FROM dbo.ExceptionRequestViolation erv " +
"        WHERE erv.id = detail.id " +
"          AND erv.expiryDate > GETDATE() " +
"    ), " +
"    1, 0 " +
") AS exception, " +
