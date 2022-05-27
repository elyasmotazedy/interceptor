import authParams from "./authParams";
import { api, setAuth } from "./";

export const login = async (username, password) => {
  try {
    const {
      data: { data },
    } = await api.post(`/user/login`, {
      ...authParams,
      username,
      password,
    });

    setAuth(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};
