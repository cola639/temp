// utils/withPageTitle.js
import React, { useEffect } from 'react';

export function withPageTitle(Component, defaultPrefix = 'CBMT') {
  function Wrapped(props) {
    useEffect(() => {
      const title = Component.title || '';
      document.title = title ? `${defaultPrefix} - ${title}` : defaultPrefix;
    }, []);

    return <Component {...props} />;
  }

  Wrapped.displayName = `WithPageTitle(${Component.displayName || Component.name || 'Component'})`;

  return Wrapped;
}


import { withPageTitle } from '../utils/withPageTitle';

export const createRouteProps = (Component, title, props = {}) => {
  const Enhanced = withPageTitle(Component);

  return {
    element: <Enhanced {...props} />,
    errorElement: <ErrorBoundary />,
  };
};
