import http from '../utils/http';

// development
export const API_URL = 'https://hacker-news.firebaseio.com/v0/';

// ------- Auth ----------------------

export const login = (username, password) => {
  return http.post(`${API_URL}/login`, {
    username,
    password,
  });
};

export const logout = userId => {
  return http.post(`${API_URL}/logout/${userId}`);
};