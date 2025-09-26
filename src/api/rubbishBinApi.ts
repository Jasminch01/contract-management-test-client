import { Buyer, Seller, TContract } from "@/types/types";
import { instance } from "./api";

export const getTrashData = async (
  page: number = 1, 
  limit: number = 10, 
  type?: string | null
): Promise<TrashData> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });
        
    if (type) {
      params.append('type', type);
    }
        
    const response = await instance.get(`trash?${params.toString()}`);
    console.log('API Response:', response.data);
    
    // Handle the nested data structure from your backend
    return response.data.data;
    
  } catch (error) {
    console.error("Error fetching trash data:", error);
    throw error;
  }
};

// backend response
export interface TrashData {
  buyers?: Buyer[];
  sellers?: Seller[];
  contracts?: TContract[];
  pagination: PaginationData;
  summary: TrashSummary;
}

export interface PaginationData {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
}

export interface TrashSummary {
  totalBuyers: number;
  totalSellers: number;
  totalContracts: number;
  totalDeleted: number;
}

// query parameters interface for better type safety
export interface TrashQueryParams {
  page?: number;
  limit?: number;
  type?: 'buyers' | 'sellers' | 'contracts';
}

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
    const data = await instance.delete("trash/emptyall");
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
