function formatValue(value) {
  if (typeof value !== "string") return "";

  // 判断是否是 base64
  const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  if (base64Regex.test(value) && value.length % 4 === 0) {
    return value;
  }

  const words = value.trim().split(/\s+/);

  let initials;
  if (words.length === 1) {
    // 单词时取前两个字母
    initials = words[0].substring(0, 2).toUpperCase();
  } else {
    // 多个单词时取前两个单词的首字母
    initials = words.map(w => w[0].toUpperCase()).slice(0, 2).join("");
  }

  return initials;
}
