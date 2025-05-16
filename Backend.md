@Query("SELECT log FROM ActivityLog log " +
       "WHERE log.auditLevel IN (1, 2) AND log.applicationId = :applicationId " +
       "ORDER BY log.actionDate DESC")
Page<ActivityLog> findApplicationLogs(@Param("applicationId") Long applicationId, Pageable pageable);


@GetMapping("/getActiveLog")
public ResponseEntity<ResponseBody> getActiveLog(@RequestParam Long applicationId,
                                                 @RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "10") int size) {
    Pageable pageable = PageRequest.of(page, size);
    Page<ActivityLog> activityLog = activityLogRepository.findApplicationLogs(applicationId, pageable);
    return ResponseBody.ok("Okay", activityLog);
}

