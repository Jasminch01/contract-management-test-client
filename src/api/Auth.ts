import { instance } from "./api";
interface LoginResponse {
  token?: string;
  message?: string;
}

export const userLogin = async (email: string, userId: string) => {
  try {
    const res = await instance.post<LoginResponse>(`auth/login`, {
      email,
      userId,
    });
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
