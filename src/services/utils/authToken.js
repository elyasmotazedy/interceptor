const TOKEN_NAME = 'token';

class Storage {
  constructor() {
    if (typeof window !== 'undefined') {
      this.storage = localStorage;
    }
  }

  async getToken() {
    let data = {};
    const token = this.storage.getItem(TOKEN_NAME);
    if (token) {
      const [accessToken, refreshToken] = token.split('&__&');
      if (accessToken) {
        data = { accessToken, refreshToken };
      }
    }

    return Promise.resolve(data);
  }

  async setToken(accessToken, refreshToken) {
    const bindToken = `${accessToken}&__&${refreshToken}`;
    const result = this.storage.setItem(TOKEN_NAME, bindToken);

    return Promise.resolve(result);
  }

  async removeToken() {
    const result = this.storage.removeItem(TOKEN_NAME);
    return Promise.resolve(result);
  }
}

const localStore = new Storage('local');
export default localStore;
