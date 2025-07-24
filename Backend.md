    public static Date plusOneYearAndToDate(String dateStr) {
        // 定义日期格式
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy/M/d");
        // 解析成LocalDate
        LocalDate localDate = LocalDate.parse(dateStr, formatter);
        // 加一年
        LocalDate nextYear = localDate.plusYears(1);
        // 转换成Date类型
        return Date.from(nextYear.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }
