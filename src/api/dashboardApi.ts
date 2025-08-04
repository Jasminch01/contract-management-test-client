// summery

import { instance } from "./api";

export const getSummeryReport = async () => {
  try {
    const data = await instance.get(`/dashboard/summary`);
    console.log(data)
    return data;
  } catch (error) {
    return error;
  }
};
//
export const getHistoricalReport = async () => {
  try {
    const data = await instance.get(`/dashboard/historical`);
    return data;
  } catch (error) {
    return error;
  }
};
//
export const getProgressReport = async () => {
  try {
    const {data }= await instance.get(`/dashboard/progress`);
    return data;
  } catch (error) {
    return error;
  }
};
