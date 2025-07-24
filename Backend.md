@Query("SELECT contact FROM Contact contact WHERE contact.staffId IN :staffIds")
List<Contact> batchFindByStaffIds(@Param("staffIds") List<String> staffIds);



public static Date plusOneYearAndToDate(Date date) {
        if (date == null) return null;
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.YEAR, 1);
        return cal.getTime();
    }


public static Contact findByStaffId(List<Contact> list, Long staffId) {
    return list.stream()
        .filter(c -> staffId.equals(c.getStaffId()))
        .findFirst()
        .orElse(null);
}


public static Contact safeFindByStaffId(List<Contact> list, String staffId) {
    if (list == null || staffId == null || staffId.trim().isEmpty()) {
        return null;
    }
    return list.stream()
            .filter(c -> staffId.equals(c.getStaffId()))
            .findFirst()
            .orElse(null);
}
