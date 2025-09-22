明白了，你的需求如下：

---

## ✅ 明确需求

* **保留两个方法：`loadPage` 与 `createRouteProps`**（不改名）
* 所有组件在组件文件内定义：

  * `Component.title`
  * `Component.loader`（可为空）
* `loadPage` 负责设置标题并调用组件的 loader（如存在）
* `createRouteProps` 从组件中读取配置，返回标准路由项（element、loader、errorElement）
* 保持清晰、优雅、可复用的最佳实践风格

---

## ✅ ✅ 最终重构实现（保留原方法名）

```tsx
// routerUtils.ts or similar

/**
 * 设置页面标题（客户端环境下）
 */
const setDocumentTitle = (title?: string) => {
  if (typeof document !== 'undefined') {
    document.title = title ? `CBMT - ${title}` : 'CBMT';
  }
};

/**
 * 构建 loader，统一处理标题和组件内部 loader 调用
 */
export const loadPage = (Component, customTitle) => {
  return async (...args) => {
    try {
      const title = customTitle || Component?.title || '';
      setDocumentTitle(title);

      if (typeof Component?.loader === 'function') {
        return await Component.loader(...args);
      }

      return null;
    } catch (err) {
      console.error(`[Loader Error] in ${Component?.name}:`, err);
      throw err; // 提供给 errorElement 使用
    }
  };
};

/**
 * 构建符合 React Router 要求的 route 配置项
 */
export const createRouteProps = (Component, title, props = {}) => ({
  element: <Component {...props} />,
  loader: loadPage(Component, title),
  errorElement: <ErrorBoundary />,
});
```

---

## 📌 使用方式不变 ✅

你可以像原来一样写：

```tsx
<Route path="dashboard" {...createRouteProps(Dashboard)} />
<Route path="admin" {...createRouteProps(Admin, "Admin Page")} />
```

即支持从组件读取 title，也支持传入自定义 title（优先级更高）。

---

## ✅ 示例组件定义（保持不变）

```tsx
// src/pages/Dashboard/index.jsx
function Dashboard() {
  return <div>Dashboard Page</div>;
}

Dashboard.title = "Dashboard";
Dashboard.loader = async ({ params }) => {
  // 可选逻辑
};

export default Dashboard;
```

---

## 🚀 最终优势总结

| 优化点                      | 说明                                |
| ------------------------ | --------------------------------- |
| ✅ 方法名不变                  | 保持项目接口一致性                         |
| ✅ 支持组件内定义 title / loader | 更模块化、更易维护                         |
| ✅ loader 支持空定义           | 更灵活                               |
| ✅ 支持传入自定义标题（优先级高）        | 更可配置                              |
| ✅ 错误捕获和日志                | 增强调试能力                            |
| ✅ 保持统一格式输出               | `element`、`loader`、`errorElement` |

---

如果你想做进一步优化，比如：

* 为路由动态生成 `title`（如含参数）
* 支持懒加载组件（结合 `React.lazy` 和 `Suspense`）
* 支持国际化的动态标题（i18n）

也可以继续告诉我，我可以帮你扩展。
