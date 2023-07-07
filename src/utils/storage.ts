export const getToken = () => localStorage.getItem("token");
export const setToken = (val: any) => localStorage.setItem("token", val);
export const removeToken = () => localStorage.removeItem("token");