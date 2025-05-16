@Autowired
private ViolationRemediationPlanRepository violationRepository;

@PostMapping("/saveViolationRemediationPlan")
public ResponseEntity<ResponseBody> saveViolation(
    @RequestBody ViolationRemediationPlan violationRemediationPlan
) {
    violationRepository.save(violationRemediationPlan);  // 直接保存
    return ResponseBody.ok("Okay");
}
