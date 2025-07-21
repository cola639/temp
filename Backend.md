import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface ViolationRemediationPlanRepository extends JpaRepository<ViolationRemediationPlan, Long> {

    @Transactional
    @Modifying
    @Query("DELETE FROM ViolationRemediationPlan v WHERE v.updaterStaffId = :updaterStaffId")
    void deleteByUpdaterStaffId(String updaterStaffId);
}
