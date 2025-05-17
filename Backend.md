你可以使用 `dayjs` 搭配 `utc` 和 `timezone` 插件来把时间从 ISO 格式 `"2025-04-10T11:42:24"` 转换成 `"10-Apr-2025 19:42 HKT"` 格式。

---

### ✅ 步骤一：安装依赖

如果你用的是 Node.js 或前端项目：

```bash
npm install dayjs
npm install dayjs-plugin-utc
npm install dayjs-plugin-timezone
```

或者全装（推荐）：

```bash
npm install dayjs dayjs-plugin-utc dayjs-plugin-timezone
```

---

### ✅ 步骤二：JS 代码

```javascript
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

function formatToHKT(isoString) {
  return dayjs(isoString)
    .tz('Asia/Hong_Kong')
    .format('DD-MMM-YYYY HH:mm') + ' HKT';
}

// 示例
const isoTime = "2025-04-10T11:42:24";
console.log(formatToHKT(isoTime));
// 输出：10-Apr-2025 19:42 HKT
```

---

### 🧠 补充说明

* `tz('Asia/Hong_Kong')` 会自动把时间转换到香港时区（UTC+8）。
* `.format('DD-MMM-YYYY HH:mm')` 控制输出样式，例如：

  * `10-Apr-2025 19:42`

---

需要我帮你转换一个数组/列表中的所有时间字符串吗？可以一起写成批处理函数。
