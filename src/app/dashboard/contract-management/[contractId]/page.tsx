"use client";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { IoWarning } from "react-icons/io5";
import { fetchContract } from "@/api/ContractAPi";
import Contract from "@/components/contract/Contract";
import { TContract } from "@/types/types";

// Define error type for better type safety
interface ApiError {
  message: string;
}

const ContractDetailsPage: React.FC = () => {
  const { contractId } = useParams();
  const router = useRouter();

  // Ensure contractId is a string
  const id = Array.isArray(contractId) ? contractId[0] : contractId;

  // Fetch contract data with proper typing
  const {
    data: contractData,
    isLoading,
    isError,
    error,
  } = useQuery<TContract, ApiError>({
    queryKey: ["contract", id],
    queryFn: async (): Promise<TContract> => {
      const result = await fetchContract(id as string);
      return result as TContract;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: ApiError) => {
      if (error?.message?.includes("not found")) {
        return false;
      }
      return failureCount < 3;
    },
  });
  const handleBack = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    router.back();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="mt-6">
        <div className="border-b border-gray-300">
          <div className="mx-auto max-w-6xl relative mb-5">
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer absolute left-0"
            >
              <MdKeyboardBackspace size={24} />
            </button>
            <h1 className="text-xl font-bold text-center">
              Loading Contract...
            </h1>
          </div>
        </div>
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2A5D36]"></div>
          <span className="ml-3 text-gray-600">
            Loading contract details...
          </span>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="mt-6">
        <div className="border-b border-gray-300">
          <div className="mx-auto max-w-6xl relative mb-5">
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer absolute left-0"
            >
              <MdKeyboardBackspace size={24} />
            </button>
            <h1 className="text-xl font-bold text-center">Contract Details</h1>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center min-h-64">
          <div className="text-red-500 text-center">
            <IoWarning className="text-4xl mx-auto mb-2" />
            <p className="text-lg font-semibold">Error loading contract</p>
            <p className="text-sm text-gray-600 mt-1">
              {error?.message || "Something went wrong"}
            </p>
          </div>
          <button
            onClick={() => router.push("/contract-management")}
            className="mt-4 px-4 py-2 bg-[#2A5D36] text-white rounded hover:bg-[#1e4728] transition-colors"
          >
            Back to Contracts
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!contractData) {
    return (
      <div className="mt-6">
        <div className="border-b border-gray-300">
          <div className="mx-auto max-w-6xl relative mb-5">
            <button
              type="button"
              onClick={handleBack}
              className="cursor-pointer absolute left-0"
            >
              <MdKeyboardBackspace size={24} />
            </button>
            <h1 className="text-xl font-bold text-center">Contract Details</h1>
          </div>
        </div>
        <div className="flex justify-center items-center min-h-64">
          <div className="text-gray-500 text-center">
            <p className="text-lg">No contract data available</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state - render the contract
  return (
    <div className="mt-6">
      <div className="border-b border-gray-300">
        <div className="mx-auto max-w-6xl relative mb-5">
          <button
            type="button"
            onClick={handleBack}
            className="cursor-pointer absolute left-0"
          >
            <MdKeyboardBackspace size={24} />
          </button>
          <h1 className="text-xl font-bold text-center">
            Contract {contractData.contractNumber}
          </h1>
        </div>
      </div>
      <Contract contract={contractData} />
    </div>
  );
};

export default ContractDetailsPage;
