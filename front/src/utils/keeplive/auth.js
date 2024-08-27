import Cookies from 'js-cookie';
const TokenKey = 'token';
const themeConfig = { useCookies: true };
export function getToken() {
  // return Cookies.get(TokenKey);
  if (themeConfig.useCookies) {
    return Cookies.get(TokenKey);
  } else {
    return localStorage.getItem(TokenKey);
  }
}

export function setToken(token) {
  if (themeConfig.useCookies) {
    Cookies.set(TokenKey, token, { path: '/' });
  } else {
    localStorage.setDprotalLocalItem(TokenKey, token);
  }
}

export function removeToken() {
  if (themeConfig.useCookies) {
    Cookies.remove(TokenKey);
  } else {
    localStorage.removeItem(TokenKey);
  }
}

export default {
  getTokenKey() {
    return this.TokenKey;
  },
  getToken() {
    return getToken();
  },
  setToken(token) {
    return setToken(token);
  },
  removeToken() {
    Cookies.remove(this.TokenKey);
    return null;
  }
};
