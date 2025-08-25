import { instance } from "./api";
interface LoginResponse {
  token?: string;
  message?: string;
}

export const userLogin = async (email: string, password: string) => {

  try {
    const res = await instance.post<LoginResponse>(`auth/login`, {
      email,
      password,
    });
    // console.log(res);

    // IMPORTANT: Access token from res.data.token, NOT res.token
    if (res.data.token) {
      localStorage.setItem("accesstoken", res.data.token);
    }

    return res;
  } catch (error) {
    console.log(error);
    throw error; // Re-throw so the component can handle it
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
