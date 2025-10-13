// router/routes.js
import React from "react";

function lazyRoute(importFn) {
  return {
    loader: async (...args) => {
      const mod = await importFn();
      if (mod.loader) {
        return mod.loader(...args);
      }
      return null;
    },
    element: React.createElement(
      React.Suspense,
      { fallback: <div>Loading...</div> },
      React.createElement(React.lazy(importFn))
    ),
  };
}

const routes = [
  {
    path: "/",
    element: <div>Home</div>,
  },
  {
    path: "/dashboard",
    ...lazyRoute(() => import("../pages/Dashboard")),
  },
];

export default routes;
