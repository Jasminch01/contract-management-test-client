"use client";
import { fetchContract } from "@/api/ContractAPi";
import DuplicateContract from "@/components/contract/DuplicateContract";
import { TContract } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "next/dist/server/api-utils";
import { useParams } from "next/navigation";
const ContractDupLicatepage = () => {
  const { contractId } = useParams();
  // Fetch contract data with proper typing
  const {
    data: contractData,
    isLoading,
    isError,
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div className="text-red-500">{}</div>;
  }

  if (!contractData) {
    return <div>No contract data available</div>;
  }

  return (
    <div>
      {/* <Contract contract={contractData} /> */}
      <DuplicateContract contract={contractData} />
    </div>
  );
};

export default ContractDupLicatepage;
