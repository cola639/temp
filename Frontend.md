export const loadPage = (Component: any, customTitle?: string) => {
  const maybeLoader = Component?.loader;

  const title = customTitle || Component?.title || '';

  // 没有 loader，返回同步函数（关键点！）
  if (typeof maybeLoader !== 'function') {
    return () => {
      setDocumentTitle(title);
      return null;
    };
  }

  // 有 loader，返回异步函数
  return async (...args: any[]) => {
    setDocumentTitle(title);
    return await maybeLoader(...args);
  };
};
