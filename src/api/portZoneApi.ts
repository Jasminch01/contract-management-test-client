  import { instance } from "./api";
  export interface PortZoneBid {
    _id?: string;
    label:
      | "Outer Harbor"
      | "Port Lincoln"
      | "Port Giles"
      | "Wallaroo"
      | "Lucky Bay"
      | "Thevenard"
      | "Wallaroo Tports";
    season: string; // format: "24/25"
    date: string; // ISO date string
    APW1?: number | null; // Fixed: Optional + null (consistent with other declarations)
    H1?: number | null;
    H2?: number | null;
    AUH2?: number | null;
    ASW1?: number | null;
    AGP1?: number | null;
    SFW1?: number | null;
    BAR1?: number | null;
    MA1?: number | null;
    CM1?: number | null;
    COMD?: number | null;
    CANS?: number | null;
    FIEV?: number | null;
    "NIP/HAL"?: number | null;
    createdAt?: string;
    updatedAt?: string;
  }
  // API functions
  export const fetchPortZoneBids = async (
    date: string,
    season: string
  ): Promise<PortZoneBid[]> => {
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)){
      // console.error("Invalid date format. Expected YYYY-MM-DD.", date);
      throw new Error("Invalid date format, expected YYYY-MM-DD.");
    }

    console.log("Fetching port zone bids for date:", date, "and season:", season);
    try{
      const response = await instance.get(
        `portZone-bids?date=${encodeURIComponent(date)}&season=${encodeURIComponent(season)}`
      );
      // console.log("API response:", response);
      if(!response?.data){
        // console.error("Unexpected API response structure:", response);
        throw new Error("Unexpected API response structure");
      }
      return response.data || [];
    } catch (error) {
      // console.error("Error fetching port zone bids:", error);
      throw new Error("Error fetching port zone bids");
    }
  };

  export const updatePortZoneBid = async (
    bid: Partial<PortZoneBid> & { label: string; date: string; season: string }
  ): Promise<PortZoneBid> => {
    const response = await instance.post("portZone-bids", bid);
    if (!response) {
      throw new Error("Failed to update port zone bid");
    }
    return response.data;
  };

  export const createPortZoneBid = async (
    bid: Omit<PortZoneBid, "_id" | "createdAt" | "updatedAt">
  ): Promise<PortZoneBid> => {
    const response = await instance.post("portZone-bids", bid);
    if (!response) {
      throw new Error("Failed to create port zone bid");
    }
    return response.data;
  };
