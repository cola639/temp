export const loadPage = (Component, customTitle) => {
  const hasAsyncLoader = typeof Component?.loader === 'function';

  const setTitle = () => {
    const title = customTitle || Component?.title || '';
    if (typeof document !== 'undefined') {
      document.title = title ? `CBMT - ${title}` : 'CBMT';
    }
  };

  // 如果组件有异步 loader，返回 async 函数
  if (hasAsyncLoader) {
    return async (...args) => {
      setTitle();
      return await Component.loader(...args);
    };
  }

  // 否则返回同步函数，避免 React Router 多余的等待
  return () => {
    setTitle();
    return null;
  };
};
