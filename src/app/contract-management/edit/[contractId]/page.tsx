"use client";
// import Contract from "@/components/contract/Contract";
import EditableContract from "@/components/contract/EditableContract";
import { contracts } from "@/data/data";
import { Contract as TContract } from "@/types/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ContractEditpage = () => {
  const [contractData, setContractData] = useState<TContract | null>(null);
  const { contractId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        setLoading(true);
        // const response = await fetch("/contracts.json");
        // const contracts: TContract[] = await response.json();
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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!contractData) {
    return <div>No contract data available</div>;
  }

  return (
    <div>
      {/* <Contract contract={contractData} /> */}
      <EditableContract contract={contractData} />
    </div>
  );
};

export default ContractEditpage;
