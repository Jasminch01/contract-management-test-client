import { Contract } from "@/types/types";
import { instance } from "./api";
import axios from "axios";

export const createContract = async (contract: Contract) => {
  try {
    const res = await instance.post("contracts", contract);
    console.log(res);
    return res;
  } catch (error) {
    console.log(error);
  }
};

// API functions
export const fetchContracts = async (): Promise<Contract[]> => {
  try {
    const { data } = await instance.get("contracts");
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

//fetch contract
export const fetchContract = async (id: string) => {
  try {
    const contract = await instance.get(`/contracts/${id}`);
    return contract;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error fetching buyers:", error.message);
    } else {
      console.error("Unexpected error fetching buyers:", error);
    }
    return {};
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateContract = async (updatedContract: any, id: string) => {
  try {
    const contract = await instance.put(`/contracts/${id}`, updatedContract);
    return contract;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error update buyers:", error.message);
    } else {
      console.error("Unexpected error update buyers:", error);
    }
    return {};
  }
};

export const moveContractToTrash = async (
  buyerIds: string[]
): Promise<void> => {
  try {
    if (buyerIds.length === 0) return;

    await Promise.all(
      buyerIds.map((id) => instance.patch(`contracts/${id}/trash`))
    );
  } catch (error) {
    console.error("Move to trash error:", error);
    throw error;
  }
};
