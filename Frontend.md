好的！下面是将上面所有 TypeScript 结构 **改写为 JavaScript 版本（ES6）** 的版本，方便你直接在 JS 项目中使用。

---

## ✅ 1. 页面组件写法（含 loader、pageTitle）

```jsx
// src/pages/Dashboard.jsx
import { useLoaderData } from "react-router-dom";
import axios from "axios";

export async function dashboardLoader() {
  const res = await axios.get("/api/dashboard");
  return res.data;
}

function Dashboard() {
  const data = useLoaderData();
  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}

// 为支持自动加载和标题
Dashboard.pageTitle = "Dashboard";
Dashboard.loader = dashboardLoader;

export default Dashboard;
```

---

## ✅ 2. `createRouteProps.js` — 路由生成工具

```jsx
// utils/createRouteProps.js
import React from "react";
import ErrorBoundary from "../components/ErrorBoundary";
import WithPageTitle from "../components/WithPageTitle";

/**
 * 封装每个页面的路由配置：
 * - 加载 loader（如果有）
 * - 包装 pageTitle
 * - 包装 ErrorBoundary
 */
export function createRouteProps(PageComponent) {
  return {
    element: (
      <WithPageTitle title={PageComponent.pageTitle}>
        <PageComponent />
      </WithPageTitle>
    ),
    loader: PageComponent.loader,
    errorElement: <ErrorBoundary />,
  };
}
```

---

## ✅ 3. `WithPageTitle.jsx` — 页面标题处理组件

```jsx
// components/WithPageTitle.jsx
import { useEffect } from "react";

function WithPageTitle({ title, children }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
  }, [title]);

  return <>{children}</>;
}

export default WithPageTitle;
```

---

## ✅ 4. `ErrorBoundary.jsx` — 简单错误边界组件（可替换为你自己的）

```jsx
// components/ErrorBoundary.jsx
import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <div>页面出错了：{this.state.error?.message}</div>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## ✅ 5. 路由配置（使用 createRouteProps）

```jsx
// router/routes.js
import Dashboard from "../pages/Dashboard";
import { createRouteProps } from "../utils/createRouteProps";
import Layout from "../layout/Layout"; // 你的 layout

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "dashboard",
        ...createRouteProps(Dashboard),
      },
    ],
  },
];

export default routes;
```

---

## ✅ 6. App.jsx — 启动 RouterProvider

```jsx
// App.jsx
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import routes from "./router/routes";

const router = createBrowserRouter(routes);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

---

## ✅ 完整目录结构建议

```
src/
  pages/
    Dashboard.jsx
  utils/
    createRouteProps.js
  components/
    WithPageTitle.jsx
    ErrorBoundary.jsx
  layout/
    Layout.jsx
  router/
    routes.js
  App.jsx
```

---

## ✅ 功能确认清单 ✅

| 功能                  | 是否实现 |
| ------------------- | ---- |
| 页面 loader（支持 async） | ✅    |
| 页面标题自动设置            | ✅    |
| 错误边界处理              | ✅    |
| 只点击一次即可正确加载页面       | ✅    |
| JS 项目兼容性            | ✅    |
| 可扩展权限、meta、缓存等      | ✅    |

---

## ✅ 如果你需要拓展：

* ✅ 加权限控制（如登录验证）
* ✅ 国际化 title
* ✅ loader 缓存策略（例如结合 SWR / react-query）

我也可以继续帮你做扩展。如果你想要一个权限验证 loader 示例，我可以加一版。是否需要？
