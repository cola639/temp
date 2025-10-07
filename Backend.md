DATE_FORMAT(
    STR_TO_DATE(LOWER(TRIM(BOTH '''' FROM SUBSTRING_INDEX(column_name, '-', -1))), '%M %Y'),
    '%Y%m'
  ) AS year_month_long


SELECT 
  DATE_FORMAT(
    STR_TO_DATE(LOWER(TRIM(BOTH '''' FROM SUBSTRING_INDEX(column_name, '-', -1))), '%M %Y'),
    '%Y%m'
  ) AS year_month_long
FROM your_table;


SELECT 
  column_name,
  TO_NUMBER(
    TO_CHAR(
      TO_DATE(
        INITCAP(
          REGEXP_SUBSTR(column_name, '''([[:alpha:]]+ [0-9]{4})''', 1, 1, NULL, 1)
        ),
        'Month YYYY'
      ),
      'YYYYMM'
    )
  ) AS year_month_int
FROM your_table;


  TO_NUMBER(
    TO_CHAR(
      TO_DATE(
        INITCAP(
          TRIM('''' FROM SUBSTR(column_name, INSTR(column_name, '-', -1) + 1))
        ),
        'Month YYYY'
      ),
      'YYYYMM'
    )
  ) AS year_month_int
