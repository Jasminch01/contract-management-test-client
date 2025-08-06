import { instance } from "./api";

export const userLogin = async (email: string, password: string) => {
  console.log(email, password)
  try {
    const res = await instance.post(`auth/login`, { email, password });
    console.log(res)
    return res;
  } catch (error) {
    throw error;
  }
};

export const userLogOut = async () => {
  try {
    const res = await instance.post(`auth/logout`);
    return res;
  } catch (error) {
    throw error;
  }
};

export const userUpdateCredentials = async (
  email: string,
  password: string
) => {
  try {
    const res = await instance.post(`auth/update-credentials`, {
      email,
      password,
    });
    return res;
  } catch (error) {
    throw error;
  }
};
