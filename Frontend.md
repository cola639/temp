const sessionStore = {
  set(key, obj) {
    try {
      sessionStorage.setItem(key, JSON.stringify(obj));
    } catch (e) {
      console.error('❌ sessionStorage set error:', e);
    }
  },

  get(key) {
    try {
      const value = sessionStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      console.error('❌ sessionStorage get error:', e);
      return null;
    }
  },

  remove(key) {
    sessionStorage.removeItem(key);
  }
};
