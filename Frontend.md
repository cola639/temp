1. header 搞回黑色原样，保留新的filter icon
2. header对齐参考原来的，如果我不在线问Carrick要uat链接参考
3. 头像圆框黑色字体，水平垂直居中，适配base64图像和多个owners
4. 把新样式应用到全部Milestone页面，包括Carrick在做的页面，他在线和他讨论
5. 默认头像圆框随机深色，白色字体
6. 左边框保持不变


function formatValue(value) {
  if (typeof value !== "string") return "";

  const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;

  if (base64Regex.test(value) && value.length % 4 === 0) {
    return value; 
  }

  const words = value.trim().split(/\s+/);

  const initials = words.map(w => w[0].toUpperCase()).slice(0, 2).join("");

  return initials;
}
