import { Buyer, Seller, TContract } from "@/types/types";
import { instance } from "./api";

interface TrashData {
  buyers: Buyer[];
  sellers: Seller[];
  contracts: TContract[];
}

export const getTrashData = async (): Promise<TrashData> => {
  try {
    const response = await instance.get("trash");
    return response.data;
  } catch (error) {
    console.error("Error fetching trash data:", error);
    throw error;
  }
};

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
    const data = await instance.delete("trash/empty-all");
    return data;
  } catch (error) {
    throw error;
  }
};

export const restoreTrashItems = async (itemIds: string[]) => {
  try {
    const data = await instance.post(`trash/bulk/restore`, { itemIds });
    return data;
  } catch (error) {
    throw error;
  }
};
