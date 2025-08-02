import { Buyer, Contract, Seller } from "@/types/types";
import { instance } from "./api";

interface TrashData {
  buyers: Buyer[];
  sellers: Seller[];
  contracts: Contract[];
}

// Updated function with better error handling and typing
export const getTrashData = async (): Promise<TrashData> => {
  try {
    const response = await instance.get("trash");
    return response.data;
  } catch (error) {
    console.error("Error fetching trash data:", error);
    throw error; // Re-throw the error instead of returning it
  }
};
// Additional functions for trash operations
export const permanentlyDeleteTrashItems = async (itemIds: string[]) => {
  try {
    const data = await instance.delete("trash/permanent", {
      data: { ids: itemIds },
    });
    return data;
  } catch (error) {
    throw error;
  }
};

export const emptyTrashBin = async () => {
  try {
    const data = await instance.delete("trash/bulk");
    return data;
  } catch (error) {
    throw error;
  }
};
