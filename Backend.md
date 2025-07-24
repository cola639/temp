    public static Date plusOneYear(String dateStr) throws ParseException {
        // Java标准Date字符串格式
        SimpleDateFormat sdf = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy", java.util.Locale.ENGLISH);
        Date date = sdf.parse(dateStr);

        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        cal.add(Calendar.YEAR, 1);

        return cal.getTime();
    }
