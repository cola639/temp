明白 ✅，你要的行为是：

---

## ✅ 最终需求总结：

### ✅ 过滤逻辑：

1. **query 是空对象** → 返回整个数组副本
2. **query 中某字段为空**（`null`、`undefined`、`''`）→ 忽略该字段，继续用其他字段过滤
3. **数字字段** → 精确匹配 `===`
4. **字符串字段** → 不区分大小写模糊匹配：`includes()`
5. ✅ 原数组不被修改（返回的是新数组）

---

## ✅ 封装函数实现：

```js
function smartFilter(list, query) {
  // ✅ 若 query 是空对象，返回全部
  if (!query || Object.keys(query).length === 0) {
    return [...list];
  }

  return list.filter((item) => {
    return Object.entries(query).every(([key, val]) => {
      if (val === undefined || val === null || val === '') {
        return true; // ✅ 忽略空字段，继续判断其它字段
      }

      const itemVal = item[key];

      if (typeof val === 'number') {
        return itemVal === val; // ✅ 精确匹配数字
      }

      if (typeof val === 'string') {
        return (
          typeof itemVal === 'string' &&
          itemVal.toLowerCase().includes(val.toLowerCase())
        ); // ✅ 字符串模糊匹配
      }

      return false; // 其它类型忽略
    });
  });
}
```

---

## ✅ 示例用法：

```js
const list = [
  { field1: 1, field2: 'abc' },
  { field1: 2, field2: 'xyz' },
  { field1: 1, field2: 'ABC-123' },
];

smartFilter(list, { field1: 1, field2: 'abc' });
// ✅ 精确匹配 field1 === 1，模糊匹配 field2 包含 "abc"（大小写不敏感）

smartFilter(list, { field1: 1, field2: '' });
// ✅ 忽略 field2，只根据 field1 === 1 筛选

smartFilter(list, {});
// ✅ 返回所有项（副本）

smartFilter(list, { field2: 'ABC' });
// ✅ 匹配所有 field2 中包含 abc 的（不区分大小写）
```

---

## ✅ 特性对照表：

| 特性                | 是否支持 ✅        |
| ----------------- | ------------- |
| 忽略空字段（val 为 `''`） | ✅             |
| query 为 `{}` 返回全部 | ✅             |
| 字符串字段模糊匹配（不区分大小写） | ✅             |
| 数字字段精确匹配 `===`    | ✅             |
| 不影响原数组（返回副本）      | ✅ `[...list]` |

---

如你需要：

* 支持字段类型从原始 `list` 推断
* 字段值为数组时支持多值匹配（如 SQL 的 `IN`）
* 可配置哪些字段强制精确、哪些模糊

我也可以进一步封装 🔧。是否需要？
