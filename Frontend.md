你现在遇到的问题是：

> `onCell` 的样式或类名作用到了所有单元格，而不是根据每一行的 `annualReviewStatus` 变化。

---

### ✅ 原因：

你把 `onCell` 写成了一个 **全局常量**：

```tsx
const onCell = () => ({ style: { fontSize: "20px" } });
```

然后在列中引用：

```tsx
onCell: onCell
```

这个 `onCell` 没有接收到每一行 `record`，所以每个 `<td>` 都执行了相同的样式，导致全局统一生效。

---

### ✅ 正确写法：在该列中，**内联定义 onCell** 并传入 `record`

你需要让 `onCell` 能根据每一行的数据做判断：

```tsx
{
  title: <div className="text-white">Annual Review Status</div>,
  key: "annualReviewStatus",
  dataIndex: "annualReviewStatus",
  width: 150,
  ellipsis: true,
  align: "center",
  onCell: (record) => {
    let className = '';

    switch (record.annualReviewStatus) {
      case 'Completed':
        className = 'cell-green';
        break;
      case 'Pending':
        className = 'cell-yellow';
        break;
      case 'Overdue':
        className = 'cell-red';
        break;
      default:
        className = 'cell-gray';
    }

    return {
      className
    };
  }
}
```

这样每一行 `<td>` 会按自己的 `record.annualReviewStatus` 来决定 className。

---

### ✅ 补充说明：如果你有多个列都需要动态 onCell，可以提取成高阶函数：

```tsx
const getStatusCellStyle = (status) => {
  switch (status) {
    case 'Completed': return 'cell-green';
    case 'Pending': return 'cell-yellow';
    case 'Overdue': return 'cell-red';
    default: return 'cell-gray';
  }
};
```

然后在列中：

```tsx
onCell: (record) => ({
  className: getStatusCellStyle(record.annualReviewStatus)
})
```

---

### ✅ 总结

| 问题        | 原因                   | 解决方式                           |
| --------- | -------------------- | ------------------------------ |
| 所有单元格样式一样 | `onCell` 没用 `record` | 改为 `onCell: (record) => {...}` |

这样你就能实现 **根据行数据动态设置单元格背景色/样式**，而不是一刀切。

需要我给你整合 CSS 样式或演示多个列动态控制也可以继续发我。
