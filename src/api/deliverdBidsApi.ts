import { instance } from "./api";

export interface DeliveredBid {
  _id?: string;
  location: string;
  season: string; // format: "24/25"
  date: string; // ISO date string
  january?: number | null;
  february?: number | null;
  march?: number | null;
  april?: number | null;
  may?: number | null;
  june?: number | null;
  july?: number | null;
  august?: number | null;
  september?: number | null;
  october?: number | null;
  november?: number | null;
  december?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

// Fetch delivered bids for a specific date and season
export const fetchDeliveredBids = async (
  date: string,
  season: string
): Promise<DeliveredBid[]> => {
  try {
    const data = await instance.get(
      `delivered-bids?date=${date}&season=${season}`
    );
    return data.data;
  } catch (error) {
    console.error("Error fetching delivered bids:", error);
    throw error;
  }
};

export const updateDeliveredBid = async (
  bid: Partial<DeliveredBid> & { label: string; date: string; season: string }
): Promise<DeliveredBid> => {
  const response = await instance.post("delivered-bids", bid);
  if (!response) {
    throw new Error("Failed to update port zone bid");
  }
  return response.data;
};

export const createDeliveredBid = async (
  bid: Omit<DeliveredBid, "_id" | "createdAt" | "updatedAt">
): Promise<DeliveredBid> => {
  const response = await instance.post("delivered-bids", bid);
  if (!response) {
    throw new Error("Failed to create port zone bid");
  }
  return response.data;
};
