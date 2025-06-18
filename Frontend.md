好的！你要的这一整套封装成 Modal.info() 风格的 **函数式弹窗组件**，我现在就打包给你。
你只需要复制粘贴到你的项目中，即可全局调用，无需自己维护组件状态。

---

# ✅ 一整套 Popup 封装包：支持 `info`、`confirm`、`confirmAsync`

---

## 📁 目录结构建议

```
components/
  PopupBox/
    PopupBox.jsx         ← 自定义弹窗组件（你已有）
    index.js             ← 函数式调用封装（我现在给你）
```

---

## ① `PopupBox.jsx`（你的组件，保持不变）

只确保能接受这些 props：

```jsx
// props.title, props.show, props.onCancel, props.footer, props.children ...
```

---

## ② `index.js`（封装 Popup 静态调用）

```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import PopupBox from './PopupBox';

function renderPopup(props) {
  const container = document.createElement('div');
  document.body.appendChild(container);
  const root = ReactDOM.createRoot(container);

  const close = () => {
    root.unmount();
    container.remove();
  };

  const handleCancel = () => {
    props.onCancel?.();
    close();
  };

  const handleOk = () => {
    props.onOk?.();
    close();
  };

  const mergedProps = {
    ...props,
    show: true,
    onCancel: handleCancel,
    footer:
      props.footer !== undefined
        ? props.footer
        : [
            <button key="cancel" onClick={handleCancel}>
              取消
            </button>,
            <button key="ok" onClick={handleOk}>
              确定
            </button>,
          ],
  };

  root.render(<PopupBox {...mergedProps}>{props.content}</PopupBox>);

  return { close };
}

const Popup = {
  info(options) {
    return renderPopup({
      ...options,
      footer: options.footer || null,
      title: options.title || '提示',
    });
  },

  confirm(options) {
    return renderPopup({
      ...options,
      title: options.title || '确认操作',
    });
  },

  async confirmAsync(options) {
    return new Promise((resolve) => {
      renderPopup({
        ...options,
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  },
};

export default Popup;
```

---

## ✅ ③ 使用方式（任何地方都能用）

```js
import Popup from '@/components/PopupBox';

Popup.info({
  title: '操作提示',
  content: <div>保存成功</div>,
});

Popup.confirm({
  title: '确认删除？',
  content: '你确定要删除该数据？',
  onOk: () => console.log('确定'),
  onCancel: () => console.log('取消'),
});

const result = await Popup.confirmAsync({
  title: '是否提交？',
  content: '数据提交后将不可修改',
});

if (result) {
  console.log('用户点击了确定');
} else {
  console.log('用户取消了');
}
```

---

## ✅ 支持功能

| 功能                | 是否支持 |
| ----------------- | ---- |
| info 弹窗           | ✅    |
| confirm 弹窗        | ✅    |
| confirm + Promise | ✅    |
| 自动销毁 DOM          | ✅    |
| 自定义标题/按钮/footer   | ✅    |
| 多处调用 / 不干扰其他 UI   | ✅    |

---

## 🧠 Bonus：未来扩展支持

你还可以加：

* ✅ 自定义图标（如 info 成功失败图标）
* ✅ 全局 loading 按钮
* ✅ 多语言 title 映射
* ✅ 键盘 esc 关闭控制

---

👉

你已经可以直接用这一套在项目中 **像 `Modal.info()` 一样函数式地统一调用弹窗**，非常适合后台系统的提示、确认、警告等需求。

如果你需要我整理成 zip 包，或帮你做出一份 TypeScript 类型完善版本，也可以说一声，我帮你打包好 👍
