@Query("SELECT contact FROM Contact contact WHERE contact.staffId IN :staffIds")
List<Contact> batchFindByStaffIds(@Param("staffIds") List<String> staffIds);
