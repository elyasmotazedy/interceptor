import { authApi } from "./";

export const fetchProfile = async () => {
  try {
    const { data } = await authApi.get(`/user/profile`);
    return data;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export const fetchCredit = async () => {
  try {
    const { data } = await authApi.get(`/user/credit`);
    return data;
  } catch (err) {
    return false;
  }
};
