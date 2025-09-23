import axios, { AxiosResponse } from "axios";
import { instance } from "./api";
import { Buyer, BuyersPaginatedResponse, FetchBuyersParams } from "@/types/types";

export const getBuyer = async (buyerId: string) => {
  try {
    const data = await instance.get(`buyers/${buyerId}`);
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

export const getBuyers = async (
  params: FetchBuyersParams = {}
): Promise<BuyersPaginatedResponse> => {
  try {
    // Build query parameters
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        queryParams.append(key, value.toString());
      }
    });

    const response: AxiosResponse<BuyersPaginatedResponse> = await instance.get(
      `buyers?${queryParams.toString()}`
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching buyers:", error.message);
    } else {
      console.error("Unexpected error fetching buyers:", error);
    }

    // Return correct empty structure
    return {
      page: 1,
      totalPages: 0,
      total: 0,
      data: [],
    };
  }
};

export const searchBuyers = async (query: string): Promise<Buyer[]> => {
  try {
    if (!query || !query.trim()) {
      return [];
    }

    const { data } = await instance.get<Buyer[]>(
      `buyers/search?q=${encodeURIComponent(query.trim())}`
    );
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error searching sellers:", error.message);
    } else {
      console.error("Unexpected error searching sellers:", error);
    }
    return [];
  }
};

export const createBuyer = async (newBuyer: Buyer) => {
  try {
    const data = await instance.post(`buyers`, newBuyer);
    return data;
  } catch (error) {
    return error;
  }
};

export const updateBuyer = async (updatedBuyerData: Buyer, buyerId: string) => {
  try {
    const data = await instance.put(`buyers/${buyerId}`, updatedBuyerData);
    return data;
  } catch (error) {
    return error;
  }
};

export const moveBuyersToTrash = async (buyerIds: string[]): Promise<void> => {
  try {
    if (buyerIds.length === 0) return;

    await Promise.all(
      buyerIds.map((id) => instance.patch(`buyers/${id}/trash`))
    );
  } catch (error) {
    console.error("Move to trash error:", error);
    throw error;
  }
};
