@Query("SELECT h.gbgf FROM ItsoAppServiceHost h WHERE h.applicationId = :applicationId AND h.hostname = :hostname")
String findGbgf(@Param("applicationId") String applicationId, @Param("hostname") String hostname);


@Query("SELECT h.applicationId, h.hostname, h.gbgf FROM ItsoAppServiceHost h WHERE h.applicationId IN :applicationIds AND h.hostname IN :hostnames")
Map<String, String> findGbgfForBatch(@Param("applicationIds") Set<String> applicationIds, @Param("hostnames") Set<String> hostnames);
