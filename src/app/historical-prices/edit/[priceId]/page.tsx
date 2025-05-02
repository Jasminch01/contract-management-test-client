"use client";
import { HistoricalPrice } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdOutlineSave } from "react-icons/md";
import { toast } from "react-hot-toast";

const HistoricalPriceEditPage = () => {
  const { priceId } = useParams();
  const router = useRouter();
  const [formData, setFormData] = useState<HistoricalPrice>({
    id: "",
    commodity: "",
    date: "",
    price: 0,
    quality: "",
    comment: "",
  });
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/historicalPrices.json");
        const prices: HistoricalPrice[] = await response.json();

        const foundPrice = prices.find(
          (price) => price.id.toString() === priceId
        );

        if (foundPrice) {
          setFormData(foundPrice);
        } else {
          setError(`Price with ID ${priceId} not found`);
        }
      } catch (err) {
        setError("Failed to load price data");
        console.error("Error fetching price:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [priceId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // In a real app, you would make an API call here to update the data
      // For demo purposes, we'll simulate an API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Price updated successfully!");
      router.push("/historical-prices");
    } catch (err) {
      toast.error("Failed to update price");
      console.error("Error updating price:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">Loading price information...</div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">Error: {error}</div>;
  }

  if (!formData.id) {
    return <div className="text-center py-10">No price data found</div>;
  }

  return (
    <div className="pb-10">
      <div className="border-b border-gray-300 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xl font-semibold">Edit Historical Price</p>
        </div>
      </div>

      <div className="my-10 text-center">
        <p className="text-lg">{formData.commodity} Price</p>
      </div>

      <form onSubmit={handleSubmit} className="mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          {/* Left Column */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col">
              <label htmlFor="commodity" className="mb-2 font-medium">
                Commodity *
              </label>
              <input
                type="text"
                id="commodity"
                name="commodity"
                value={formData.commodity}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36]"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="price" className="mb-2 font-medium">
                Price *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3">$</span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className="w-full p-3 pl-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36]"
                  required
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col">
              <label htmlFor="date" className="mb-2 font-medium">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36]"
                required
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="quality" className="mb-2 font-medium">
                Quality *
              </label>
              <input
                type="text"
                id="quality"
                name="quality"
                value={formData.quality}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36]"
                required
              />
            </div>
          </div>
        </div>

        {/* Comment Field */}
        <div className="mb-6">
          <label htmlFor="comment" className="mb-2 font-medium">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2A5D36]"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-10">
          <button
            type="button"
            onClick={() => router.push("/historical-prices")}
            className="px-5 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="px-5 py-2 bg-[#2A5D36] text-white rounded-md flex items-center gap-2 hover:bg-[#1e4728] transition-colors disabled:opacity-70"
          >
            <MdOutlineSave className="text-lg" />
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default HistoricalPriceEditPage;
