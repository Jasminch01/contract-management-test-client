import axios from "axios";
import { instance } from "./api";
import { Buyer } from "@/types/types";

export const getBuyer = async (buyerId: string) => {
  try {
    const { data } = await instance.get(`buyers/${buyerId}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching buyers:", error.message);
    } else {
      console.error("Unexpected error fetching buyers:", error);
    }
    return error;
  }
};

export const getBuyers = async (): Promise<Buyer[]> => {
  try {
    const { data } = await instance.get<Buyer[]>(`buyers`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching buyers:", error.message);
    } else {
      console.error("Unexpected error fetching buyers:", error);
    }
    return [];
  }
};

export const createBuyer = async (newBuyer: Buyer) => {
  try {
    const { data } = await instance.post(`buyers`, newBuyer);
    return data;
  } catch (error) {
    return error;
  }
};

export const updateBuyer = async (updatedBuyerData: Buyer, buyerId: string) => {
  try {
    const { data } = await instance.put(`buyers/${buyerId}`, updatedBuyerData);
    return data;
  } catch (error) {
    return error;
  }
};
