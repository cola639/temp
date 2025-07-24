@Query("SELECT contact FROM Contact contact WHERE contact.staffId IN :staffIds")
List<Contact> batchFindByStaffIds(@Param("staffIds") List<String> staffIds);



public static Date plusOneYearAndToDate(Date date) {
        if (date == null) return null;
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.YEAR, 1);
        return cal.getTime();
    }
