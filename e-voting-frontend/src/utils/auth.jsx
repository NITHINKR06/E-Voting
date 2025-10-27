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

export const getUser = () => {
  const token = getToken();
  if (!token) return null;
  
  try {
    // Decode JWT token to get user info
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.userId || payload.id,
      name: payload.name,
      email: payload.email,
      isAdmin: payload.isAdmin || false
    };
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};