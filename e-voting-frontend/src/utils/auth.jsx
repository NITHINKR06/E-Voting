// src/utils/auth.js
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => {
  return localStorage.getItem('token');
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!getToken();
};

export const isAdmin = () => {
  // Assuming backend sets a role in JWT; decode if needed. For simplicity, check a flag.
  // In a real app, decode JWT to check role.
  return localStorage.getItem('isAdmin') === 'true';
};