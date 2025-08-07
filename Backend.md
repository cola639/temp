   @Transient // If you're using JPA, this prevents mapping to DB
    public String getOverdue() {
        if (dueDate == null) {
            log.warn("Due date is null.");
            return "no";
        }
        LocalDate today = LocalDate.now();
        Date todayZero = Date.from(today.atStartOfDay(ZoneId.systemDefault()).toInstant());
        boolean isOverdue = !dueDate.after(todayZero);
        log.debug("Check overdue. dueDate: {}, todayZero: {}, overdue: {}", dueDate, todayZero, isOverdue ? "yes" : "no");
        return isOverdue ? "yes" : "no";
    }
