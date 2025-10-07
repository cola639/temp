DATE_FORMAT(
    STR_TO_DATE(LOWER(TRIM(BOTH '''' FROM SUBSTRING_INDEX(column_name, '-', -1))), '%M %Y'),
    '%Y%m'
  ) AS year_month_long
