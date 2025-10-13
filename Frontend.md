非常好，你现在使用了下面这段标准的懒加载封装：

```js
import React from "react";

export function lazyRoute(importFn) {
  const LazyComponent = React.lazy(importFn);

  return {
    loader: async (...args) => {
      const mod = await importFn();
      if (mod.loader) {
        return mod.loader(...args);
      }
      return null;
    },
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent />
      </React.Suspense>
    ),
  };
}
```

但你仍然遇到：

> ✅ 第一次点击导航，URL 变化
> ❌ 页面 **没有渲染**，需要点击第二次才显示页面

---

## ✅ 我将快速定位你这段代码的问题

### ⚠️ **核心问题：`React.lazy()` + Vite 中 importFn 被调用了两次，不一致！**

这段代码里：

```js
const LazyComponent = React.lazy(importFn);
```

和：

```js
const mod = await importFn();
```

实际上是 **调用了两次 `importFn()`**，也就是重复 import 了页面模块！

> 这会导致 **loader 所在的模块 A** 与 **element 所在的模块 B** 是两个不同的模块实例！
> 在 Vite 的 dev 模式中，这种重复 import 会导致 React Router 无法正确追踪组件状态。

---

## ✅ 如何修复？

### ✅ 方案：**确保 loader 和组件来自**“**同一个模块实例**”

你需要只调用一次 `importFn()`，将 loader 和组件都从这个 module 中提取出来。

---

### ✅ 修复版：lazyRoute（只调用一次 importFn）

```js
import React from "react";

export function lazyRoute(importFn) {
  let modPromise = importFn(); // 只执行一次 import

  return {
    loader: async (...args) => {
      const mod = await modPromise;
      if (mod.loader) {
        return mod.loader(...args);
      }
      return null;
    },
    element: (
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyWrapper modPromise={modPromise} />
      </React.Suspense>
    ),
  };
}

// LazyWrapper：从 module promise 中获取 default 导出的组件
function LazyWrapper({ modPromise }) {
  const Lazy = React.lazy(() => modPromise.then(mod => ({ default: mod.default })));
  return <Lazy />;
}
```

---

## ✅ 说明

### ❌ 之前错误做法：

```js
React.lazy(importFn);           // 模块 A
const mod = await importFn();   // 模块 B （Vite 会重新加载一次）
```

在 Vite 中会导致组件和 loader **不是同一个 module scope**。

### ✅ 正确做法：

```js
const modPromise = importFn(); // 同一个 module 实例
```

---

## ✅ 示例：使用该 `lazyRoute` 加载页面

### 📁 pages/Dashboard.jsx

```jsx
import { useLoaderData } from "react-router-dom";

export async function loader() {
  await new Promise(res => setTimeout(res, 500));
  return { message: "Dashboard loaded" };
}

export default function Dashboard() {
  const data = useLoaderData();
  return <div>{data.message}</div>;
}
```

---

### 🧭 router/routes.js

```js
import { lazyRoute } from "../utils/lazyRoute";

const routes = [
  {
    path: "/",
    element: <div>Home Page</div>,
  },
  {
    path: "/dashboard",
    ...lazyRoute(() => import("../pages/Dashboard")),
  },
];

export default routes;
```

---

## ✅ 测试

* 使用 Vite 启动项目 `npm run dev`
* 点击导航跳转到 `/dashboard`
* ✅ 页面应立即加载并显示 `Dashboard loaded`
* ❌ 不再需要点击两次

---

## ✅ 总结：你当前问题的根本原因

| 问题                      | 原因                                                |
| ----------------------- | ------------------------------------------------- |
| 第一次点击 loader 执行了，页面却不渲染 | 组件懒加载和 loader 加载使用了 **两个 module 实例**              |
| 使用 Vite 开发环境更明显         | Vite 的模块加载是 ESM 动态 import，**每次 import() 都是新模块实例** |

---

## ✅ 彻底解决 ✅

> ✅ ✅ ✅
> 使用 **`modPromise = importFn()` 提前执行一次**，然后在 loader 和 component 中都使用同一个 `modPromise`

这样你就彻底修复了“点击两次才能加载”的 bug。

---

如果你需要我将修复过的 `lazyRoute` 封装给你作为完整文件复制，或者放进 CodeSandbox，我也可以马上发。是否需要？
