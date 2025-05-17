@Repository
public interface ViolationRepository extends JpaRepository<ViolationRemediationPlan, Long> {

    @Query(value = "SELECT * FROM dbo.ViolationRemediationPlan " +
                   "WHERE checkId = :checkId " +
                   "AND checkName = :checkName " +
                   "AND hostname = :hostname",
           nativeQuery = true)
    ViolationRemediationPlan findHostViolation(@Param("checkId") String checkId,
                                               @Param("checkName") String checkName,
                                               @Param("hostname") String hostname);
}
