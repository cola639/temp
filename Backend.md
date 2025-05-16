    "WHERE applicationId = :applicationId " +
    "AND hostname IS NOT NULL " +
    "AND EXISTS ( " +
    "    SELECT 1 FROM ( " +
    "        SELECT TOP 1 month, week " +
    "        FROM dbo.RemediationDetail " +
    "        ORDER BY month DESC, week DESC " +
    "    ) AS latest " +
    "    WHERE latest.month = RemediationDetail.month " +
    "      AND latest.week = RemediationDetail.week " +
    ")"


/**
 * 从字符串中提取所有 http(s) 链接
 * @param {string} text - 包含链接的原始字符串
 * @returns {string[]} - 提取出的链接数组
 */
function extractUrls(text) {
  if (!text) return [];
  return text.match(/https?:\/\/[^\s]+/g) || [];
}
