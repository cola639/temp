  useEffect(() => {
    // 从最后一个匹配路由中取出 element 的 type（即组件）
    const currentRoute = matches[matches.length - 1];
    const Component = currentRoute?.route?.element?.type;

    const title = Component?.title;

    document.title = title ? `CBMT - ${title}` : DEFAULT_TITLE;
  }, [location, matches]);
