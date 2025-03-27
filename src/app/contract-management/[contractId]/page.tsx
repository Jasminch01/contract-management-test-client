"use client";
import Contract from "@/components/contract/Contract";
import { useParams } from "next/navigation";
import React from "react";

const ContractDetailsPage = () => {
  // Get the ID from the URL parameters
  const { contractId } = useParams<{ contractId: string }>();

  return (
    <div className="mt-10">
      <h1 className="text-xl font-bold text-center mb-3">Contract {contractId}</h1>
      <hr className="border-[1px] border-gray-300" />

      <Contract />
    </div>
  );
};

export default ContractDetailsPage;
