import { instance } from "./api";

// In src/api/deliverdBidsApi.ts
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

export const fetchDeliveredBids = async (
  date: string,
  season: string
): Promise<DeliveredBid[]> => {
  try {
    const response = await instance.get(
      `delivered-bids?date=${encodeURIComponent(date)}&season=${encodeURIComponent(season)}`
    );
    // console.log("Fetched delivered bids response:", response.data); // Debug
    
    const bids = response.data.data || response.data; // Handle both response structures
    return bids.map((bid: any) => ({
      _id: bid._id,
      location: bid.label, // Map backend 'label' to frontend 'location'
      season: bid.season,
      date: bid.date,
      january: bid.monthlyValues?.January ?? null,
      february: bid.monthlyValues?.February ?? null,
      march: bid.monthlyValues?.March ?? null,
      april: bid.monthlyValues?.April ?? null,
      may: bid.monthlyValues?.May ?? null,
      june: bid.monthlyValues?.June ?? null,
      july: bid.monthlyValues?.July ?? null,
      august: bid.monthlyValues?.August ?? null,
      september: bid.monthlyValues?.September ?? null,
      october: bid.monthlyValues?.October ?? null,
      november: bid.monthlyValues?.November ?? null,
      december: bid.monthlyValues?.December ?? null,
      createdAt: bid.createdAt,
      updatedAt: bid.updatedAt,
    }));
  } catch (error) {
    console.error("Error fetching delivered bids:", error);
    throw error;
  }
};

// ... (updateDeliveredBid and createDeliveredBid unchanged, but ensure 'location' maps to 'label')
export const updateDeliveredBid = async (
  bid: Partial<DeliveredBid> & { location: string; date: string; season: string }
): Promise<DeliveredBid> => {
  const payload = {
    ...bid,
    label: bid.location, // Map frontend 'location' to backend 'label'
    monthlyValues: {
      January: bid.january ?? null,
      February: bid.february ?? null,
      March: bid.march ?? null,
      April: bid.april ?? null,
      May: bid.may ?? null,
      June: bid.june ?? null,
      July: bid.july ?? null,
      August: bid.august ?? null,
      September: bid.september ?? null,
      October: bid.october ?? null,
      November: bid.november ?? null,
      December: bid.december ?? null,
    },
  };
  const response = await instance.post("delivered-bids", payload);
  if (!response) {
    throw new Error("Failed to update delivered bid");
  }
  return {
    ...response.data.data,
    location: response.data.data.label, // Map back to 'location'
    january: response.data.data.monthlyValues?.January ?? null,
    february: response.data.data.monthlyValues?.February ?? null,
    march: response.data.data.monthlyValues?.March ?? null,
    april: response.data.data.monthlyValues?.April ?? null,
    may: response.data.data.monthlyValues?.May ?? null,
    june: response.data.data.monthlyValues?.June ?? null,
    july: response.data.data.monthlyValues?.July ?? null,
    august: response.data.data.monthlyValues?.August ?? null,
    september: response.data.data.monthlyValues?.September ?? null,
    october: response.data.data.monthlyValues?.October ?? null,
    november: response.data.data.monthlyValues?.November ?? null,
    december: response.data.data.monthlyValues?.December ?? null,
  };
};

export const createDeliveredBid = async (
  bid: Omit<DeliveredBid, "_id" | "createdAt" | "updatedAt">
): Promise<DeliveredBid> => {
  const payload = {
    ...bid,
    label: bid.location, // Map frontend 'location' to backend 'label'
    monthlyValues: {
      January: bid.january ?? null,
      February: bid.february ?? null,
      March: bid.march ?? null,
      April: bid.april ?? null,
      May: bid.may ?? null,
      June: bid.june ?? null,
      July: bid.july ?? null,
      August: bid.august ?? null,
      September: bid.september ?? null,
      October: bid.october ?? null,
      November: bid.november ?? null,
      December: bid.december ?? null,
    },
  };
  const response = await instance.post("delivered-bids", payload);
  if (!response) {
    throw new Error("Failed to create delivered bid");
  }
  return {
    ...response.data.data,
    location: response.data.data.label, // Map back to 'location'
    january: response.data.data.monthlyValues?.January ?? null,
    february: response.data.data.monthlyValues?.February ?? null,
    march: response.data.data.monthlyValues?.March ?? null,
    april: response.data.data.monthlyValues?.April ?? null,
    may: response.data.data.monthlyValues?.May ?? null,
    june: response.data.data.monthlyValues?.June ?? null,
    july: response.data.data.monthlyValues?.July ?? null,
    august: response.data.data.monthlyValues?.August ?? null,
    september: response.data.data.monthlyValues?.September ?? null,
    october: response.data.data.monthlyValues?.October ?? null,
    november: response.data.data.monthlyValues?.November ?? null,
    december: response.data.data.monthlyValues?.December ?? null,
  };
};
