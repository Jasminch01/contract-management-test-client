/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
"use client";
import { fetchContract } from "@/api/ContractAPi";
import EditableContract from "@/components/contract/EditableContract";
import { Contract as TContract } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { IoWarning } from "react-icons/io5";
import { MdKeyboardBackspace } from "react-icons/md";

const ContractEditpage = () => {
  const { contractId } = useParams();
  const router = useRouter();
  const handleBack = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    router.back();
  };
  const {
    data: contractData,
    isLoading,
    isError,
    error,
  } = useQuery<TContract, ApiError>({
    queryKey: ["contract", contractId],
    queryFn: async (): Promise<TContract> => {
      const result = await fetchContract(contractId as string);
      return result as TContract;
    },
    enabled: !!contractId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: (failureCount, error: ApiError) => {
      if (error?.message?.includes("not found")) {
        return false;
      }
      return failureCount < 3;
    },
  });

  console.log("Contract Data:", contractData);

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
            <h1 className="text-xl font-bold text-center">
              Edit Contract Details
            </h1>
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

  if (!contractData) {
    return <div>No contract data available</div>;
  }

  return (
    <div>
      {/* <Contract contract={contractData} /> */}
      <EditableContract contract={contractData} initialDate={contractData.contractDate} />
    </div>
  );
};

export default ContractEditpage;
