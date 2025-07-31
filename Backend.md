SELECT vm.*, 
       vm.risk AS riskRating,
       DATEDIFF(DAY, vm.violationOccurredDate, :reportedDate) AS overdueAge
FROM VmWare vm
INNER JOIN dbo.SlaThresholds thr
    ON vm.risk = thr.risk AND vm.network = thr.network
WHERE month = :month
  AND DATEDIFF(DAY, vm.violationOccurredDate, :reportedDate) > thr.sla
  AND (vm.dueDate < CONVERT(date, GETDATE()) OR vm.dueDate IS NULL)
