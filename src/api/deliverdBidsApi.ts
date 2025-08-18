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

// Type for the bid data sent from the frontend
interface BidInput {
  label: string;
  date: string;
  season: string;
  monthlyValues?: { [key: string]: number | null };
  _id?: string;
}

export const fetchDeliveredBids = async (
  date: string,
  season: string
): Promise<DeliveredBid[]> => {
  try {
    const response = await instance.get(
      `delivered-bids?date=${encodeURIComponent(date)}&season=${encodeURIComponent(season)}`
    );

    // Debugging
    console.log("Fetched delivered bids response:", response.data);

    const bids = response.data || response.data;
    if (!Array.isArray(bids)) {
      throw new Error("Invalid response format: expected an array of bids");
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return bids.map((bid: any) => ({
      _id: bid._id,
      location: bid.label,
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

export const updateDeliveredBid = async (
  bid: BidInput & { _id: string }
): Promise<DeliveredBid> => {
  if (!bid.label || !bid.date || !bid.season) {
    throw new Error("label, date, and season are required");
  }

  const payload = {
    label: bid.label,
    date: bid.date,
    season: bid.season,
    monthlyValues: bid.monthlyValues || {},
    _id: bid._id,
  };

  // Debugging
  console.log("Sending payload to backend:", JSON.stringify(payload));

  const response = await instance.post("delivered-bids", payload);
  if (!response.data || response.status !== 200) {
    throw new Error(`Failed to update delivered bid: ${response.data?.message || "Unknown error"}`);
  }
  return {
    ...response.data,
    location: response.data.label,
    january: response.data.monthlyValues?.January ?? null,
    february: response.data.monthlyValues?.February ?? null,
    march: response.data.monthlyValues?.March ?? null,
    april: response.data.monthlyValues?.April ?? null,
    may: response.data.monthlyValues?.May ?? null,
    june: response.data.monthlyValues?.June ?? null,
    july: response.data.monthlyValues?.July ?? null,
    august: response.data.monthlyValues?.August ?? null,
    september: response.data.monthlyValues?.September ?? null,
    october: response.data.monthlyValues?.October ?? null,
    november: response.data.monthlyValues?.November ?? null,
    december: response.data.monthlyValues?.December ?? null,
  };
};

export const createDeliveredBid = async (
  bid: BidInput
): Promise<DeliveredBid> => {
  if (!bid.label || !bid.date || !bid.season) {
    throw new Error("label, date, and season are required");
  }

  const payload = {
    label: bid.label,
    date: bid.date,
    season: bid.season,
    monthlyValues: bid.monthlyValues || {},
  };
  console.log("Sending payload to backend:", JSON.stringify(payload));

  const response = await instance.post("delivered-bids", payload);
  // if (!response.data || response.status !== 200) {
  //   throw new Error(`Failed to create delivered bid: ${response.data?.message || "Unknown error"}`);
  // }
  return {
    ...response.data,
    location: response.data.label,
    january: response.data.monthlyValues?.January ?? null,
    february: response.data.monthlyValues?.February ?? null,
    march: response.data.monthlyValues?.March ?? null,
    april: response.data.monthlyValues?.April ?? null,
    may: response.data.monthlyValues?.May ?? null,
    june: response.data.monthlyValues?.June ?? null,
    july: response.data.monthlyValues?.July ?? null,
    august: response.data.monthlyValues?.August ?? null,
    september: response.data.monthlyValues?.September ?? null,
    october: response.data.monthlyValues?.October ?? null,
    november: response.data.monthlyValues?.November ?? null,
    december: response.data.monthlyValues?.December ?? null,
  };
};