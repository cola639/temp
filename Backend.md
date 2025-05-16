@Query("SELECT log FROM ActivityLog log " +
       "WHERE log.auditLevel IN (1, 2) AND log.applicationId = :applicationId " +
       "ORDER BY log.actionDate DESC")
Page<ActivityLog> findApplicationLogs(@Param("applicationId") Long applicationId, Pageable pageable);
