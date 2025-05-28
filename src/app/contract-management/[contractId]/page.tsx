"use client";
import Contract from "@/components/contract/Contract";
import { contracts } from "@/data/data";
import { Contract as TContract } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";

const ContractDetailsPage = () => {
  const [contractData, setContractData] = useState<TContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the ID from the URL parameters
  const { contractId } = useParams();

  const router = useRouter();
  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/contract-management");
  };

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        setLoading(true);
        // const response = await fetch("/contracts.json");
        // const contracts: TContract[] = await response.json();

        // Find the contract with matching ID
        const foundContract = contracts.find(
          (contract) => contract.id.toString() === contractId
        );

        if (foundContract) {
          setContractData(foundContract);
        } else {
          setError(`Contract with ID ${contractId} not found`);
        }
      } catch (err) {
        setError("Failed to load contract data");
        console.error("Error fetching contract:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContractData();
  }, [contractId]);

  if (loading) {
    return <div className="mt-6 text-center">Loading contract details...</div>;
  }

  if (error) {
    return <div className="mt-6 text-center text-red-500">{error}</div>;
  }

  if (!contractData) {
    return <div className="mt-6 text-center">No contract data available</div>;
  }

  return (
    <div className="mt-6">
      <div className="border-b border-gray-300 ">
        <div className="mx-auto max-w-6xl relative mb-5">
          <button
            type="button"
            onClick={handleBack}
            className="cursor-pointer absolute left-0"
          >
            <MdKeyboardBackspace size={24} />
          </button>
          <h1 className="text-xl font-bold text-center">
            Contract {contractData.contractNumber || contractId}
          </h1>
        </div>
      </div>
      <Contract contract={contractData} />
    </div>
  );
};

export default ContractDetailsPage;
