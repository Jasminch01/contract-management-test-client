import axios from "axios";
import { instance } from "./api";
import { Seller } from "@/types/types";

export const getseller = async (sellerId: string) => {
  try {
    const data = await instance.get(`sellers/${sellerId}`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching sellers:", error.message);
    } else {
      console.error("Unexpected error fetching sellers:", error);
    }
    return error;
  }
};

export const getsellers = async (): Promise<Seller[]> => {
  try {
    const { data } = await instance.get<Seller[]>(`sellers`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching sellers:", error.message);
    } else {
      console.error("Unexpected error fetching sellers:", error);
    }
    return [];
  }
};

export const createSeller = async (newSeller: Seller) => {
  try {
    const data = await instance.post(`sellers`, newSeller);
    return data;
  } catch (error) {
    return error;
  }
};

export const updateSeller = async (
  updatedSellerData: Seller,
  sellerId: string
) => {
  try {
    const data = await instance.put(`sellers/${sellerId}`, updatedSellerData);
    return data;
  } catch (error) {
    return error;
  }
};

export const moveSelllersToTrash = async (
  buyerIds: string[]
): Promise<void> => {
  try {
    if (buyerIds.length === 0) return;

    await Promise.all(
      buyerIds.map((id) => instance.patch(`sellers/${id}/trash`))
    );
  } catch (error) {
    console.error("Move to trash error:", error);
    throw error;
  }
};
