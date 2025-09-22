// src/router/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { createRouteProps } from './routeUtils';

import Login from '../pages/Login';
import ComingSoon from '../pages/ComingSoon';
import Reports from '../pages/Reports';
import KciReport from '../pages/KciReport';
import Guidance from '../pages/Guidance';
import Admin from '../pages/Admin';
import Layout from '../components/Layout';
import NotFound from '../components/NotFound';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/login-ad',
    element: <Login />,
  },
  {
    path: '/view',
    element: <Layout />,
    children: [
      {
        index: true,
        ...createRouteProps(ComingSoon),
      },
      {
        path: 'dashboard',
        ...createRouteProps(ComingSoon),
      },
      {
        path: 'reports',
        children: [
          {
            index: true,
            ...createRouteProps(Reports),
          },
          {
            path: 'kci-report/:kciType',
            ...createRouteProps(KciReport),
          },
        ],
      },
      {
        path: 'guidance',
        ...createRouteProps(Guidance),
      },
      {
        path: 'admin',
        ...createRouteProps(Admin),
      },
    ],
  },
  {
    path: '/',
    element: <Navigate to="/view/dashboard" replace />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);


/**
 * 设置页面标题（客户端环境）
 */
const setDocumentTitle = (title?: string) => {
  if (typeof document !== 'undefined') {
    document.title = title ? `CBMT - ${title}` : 'CBMT';
  }
};

/**
 * loadPage：设置标题 + 调用组件的 loader（如果存在）
 */
export const loadPage = (Component: any, customTitle?: string) => {
  const maybeLoader = Component?.loader;

  return (...args: any[]) => {
    const title = customTitle || Component?.title || '';
    setDocumentTitle(title);

    if (typeof maybeLoader === 'function') {
      const result = maybeLoader(...args);
      if (result instanceof Promise) return result;
      return Promise.resolve(result);
    }

    return null;
  };
};

/**
 * createRouteProps：统一创建路由项
 */
export const createRouteProps = (
  Component: any,
  title?: string,
  props: Record<string, any> = {}
) => ({
  element: <Component {...props} />,
  loader: loadPage(Component, title),
  errorElement: <ErrorBoundary />,
});
