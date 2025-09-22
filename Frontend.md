import React from 'react';
import { loadPage } from './loadPage';
import ErrorBoundary from '../components/ErrorBoundary';

export const createRouteProps = (Component, title, props = {}) => {
  const hasLoader = typeof Component?.loader === 'function';

  const route = {
    element: <Component {...props} />,
    errorElement: <ErrorBoundary />,
  };

  if (hasLoader) {
    route.loader = loadPage(Component, title);
  }

  return route;
};
