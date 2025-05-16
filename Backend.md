@Autowired
private ViolationRemediationPlanRepository violationRepository;

@PostMapping("/saveViolationRemediationPlan")
public ResponseEntity<ResponseBody> saveViolation(
    @RequestBody ViolationRemediationPlan violationRemediationPlan
) {
    violationRepository.save(violationRemediationPlan);  // 直接保存
    return ResponseBody.ok("Okay");
}


ALTER TABLE ViolationRemediationPlan
DROP COLUMN planId;

ALTER TABLE ViolationRemediationPlan
ADD planId BIGINT IDENTITY(1,1) PRIMARY KEY;
