@Query("SELECT h.gbgf FROM ItsoAppServiceHost h WHERE h.applicationId = :applicationId AND h.hostname = :hostname")
String findGbgf(@Param("applicationId") String applicationId, @Param("hostname") String hostname);
