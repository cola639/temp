@Query(value = "SELECT TOP 1 month FROM monthly_kci_history ORDER BY month DESC", nativeQuery = true)
Integer findTopMonth();
