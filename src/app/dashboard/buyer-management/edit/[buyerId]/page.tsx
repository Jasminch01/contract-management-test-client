"use client";
import { Buyer } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { MdSave, MdCancel, MdKeyboardBackspace } from "react-icons/md";
import toast from "react-hot-toast";
import { getBuyer, updateBuyer } from "@/api/buyerApi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const BuyerInformationEditPage = () => {
  const { buyerId } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const buyerIdString = buyerId?.toString() as string;

  const [buyerData, setBuyerData] = useState<Buyer | null>(null);
  const [originalBuyerData, setOriginalBuyerData] = useState<Buyer | null>(
    null
  );
  const [hasChanges, setHasChanges] = useState(false);

  // Query to fetch buyer data
  const {
    data: fetchedBuyerData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["buyer", buyerIdString],
    queryFn: () => getBuyer(buyerIdString) as Promise<Buyer>,
    enabled: !!buyerIdString,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });

  // Mutation to update buyer data
  const updateBuyerMutation = useMutation({
    mutationFn: (updatedBuyer: Buyer) =>
      updateBuyer(updatedBuyer, buyerIdString),
    onMutate: async (updatedBuyer) => {
      // Cancel any outgoing refetches for both single buyer and buyers list
      await queryClient.cancelQueries({ queryKey: ["buyer", buyerIdString] });
      await queryClient.cancelQueries({ queryKey: ["buyers"] });

      // Snapshot the previous values
      const previousBuyer = queryClient.getQueryData(["buyer", buyerIdString]);
      const previousBuyers = queryClient.getQueryData(["buyers"]);

      // Optimistically update the single buyer
      queryClient.setQueryData(["buyer", buyerIdString], updatedBuyer);

      return { previousBuyer, previousBuyers };
    },
    onError: (error, updatedBuyer, context) => {
      // Rollback both queries if the mutation fails
      if (context?.previousBuyer) {
        queryClient.setQueryData(
          ["buyer", buyerIdString],
          context.previousBuyer
        );
      }
      if (context?.previousBuyers) {
        queryClient.setQueryData(["buyers"], context.previousBuyers);
      }

      console.error(error);
      toast.error("Failed to update buyer information");
    },
    onSuccess: () => {
      toast.success("Buyer information updated successfully");

      // Invalidate queries to ensure server consistency
      queryClient.invalidateQueries({ queryKey: ["buyer", buyerIdString] });
      queryClient.invalidateQueries({ queryKey: ["buyers"] });
       queryClient.invalidateQueries({ queryKey: ["contract"] });

      // Navigate back to buyer management
      router.push(`/dashboard/buyer-management`);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure server state consistency
      queryClient.invalidateQueries({ queryKey: ["buyer", buyerIdString] });
      queryClient.invalidateQueries({ queryKey: ["buyers"] });
    },
  });

  // Set local state when data is fetched
  useEffect(() => {
    if (fetchedBuyerData) {
      setBuyerData(fetchedBuyerData);
      setOriginalBuyerData(fetchedBuyerData);
    }
  }, [fetchedBuyerData]);

  // Track changes
  useEffect(() => {
    if (buyerData && originalBuyerData) {
      const changesExist =
        JSON.stringify(buyerData) !== JSON.stringify(originalBuyerData);
      setHasChanges(changesExist);
    }
  }, [buyerData, originalBuyerData]);

  // Loading state
  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
          <p className="text-gray-600">Loading buyer data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            {error instanceof Error
              ? error.message
              : "Failed to load buyer data"}
          </p>
          <button
            onClick={() =>
              queryClient.invalidateQueries({
                queryKey: ["buyer", buyerIdString],
              })
            }
            className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!buyerData) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p className="text-red-500">Buyer not found</p>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.back();
  };

  const handleSave = async () => {
    if (!buyerData) return;
    updateBuyerMutation.mutate(buyerData);
  };

  const handleCancel = () => {
    if (originalBuyerData) {
      setBuyerData({ ...originalBuyerData });
    }
    setHasChanges(false);
  };

  return (
    <div>
      <div className="border-b border-gray-300 py-10">
        <div className="mx-auto max-w-6xl flex items-center gap-5">
          <button type="button" onClick={handleBack} className="cursor-pointer">
            <MdKeyboardBackspace size={24} />
          </button>
          <p className="text-xl font-semibold">Buyer Information</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl mt-10">
        <div className="flex flex-col items-center mx-auto max-w-6xl w-full mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full border border-gray-300 rounded-md p-6 gap-5 bg-white">
            <Field
              label="Buyer Legal Name"
              name="name"
              value={buyerData.name || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Buyer ABN"
              name="abn"
              value={buyerData.abn || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Buyer Email"
              name="email"
              value={buyerData.email || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Buyer Office Address"
              name="officeAddress"
              value={buyerData.officeAddress || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Buyer Contact Name"
              name="contactName"
              value={buyerData.contactName || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Buyer Phone Number"
              name="phoneNumber"
              value={buyerData.phoneNumber || ""}
              onChange={handleInputChange}
            />
            <Field
              label="Account Number"
              name="accountNumber"
              value={buyerData.accountNumber || ""}
              onChange={handleInputChange}
            />
          </div>

          {/* Action Buttons */}
          {hasChanges && (
            <div className="mt-10 flex gap-3">
              <button
                onClick={handleCancel}
                disabled={updateBuyerMutation.isPending}
                className="py-2 px-5 bg-gray-500 text-white rounded flex items-center gap-2 hover:bg-gray-600 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <MdCancel className="text-lg" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={updateBuyerMutation.isPending}
                className="py-2 px-5 bg-[#2A5D36] text-white rounded flex items-center gap-2 hover:bg-[#1e4a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <MdSave className="text-lg" />
                {updateBuyerMutation.isPending ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({
  label,
  name,
  value,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div>
    <label className="text-sm font-medium text-gray-700 mb-1 block">
      {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-green-700"
    />
  </div>
);

export default BuyerInformationEditPage;
