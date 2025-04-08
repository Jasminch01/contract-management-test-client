"use client";
import Contract from "@/components/contract/Contract";
import { Contract as TContract } from "@/types/types";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const ContractDetailsPage = () => {
  const [contractData, setContractData] = useState<TContract | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the ID from the URL parameters
  const { contractId } = useParams<{ contractId: string }>();

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/contracts.json");
        const contracts: TContract[] = await response.json();

        // Find the contract with matching ID
        const foundContract = contracts.find(
          (contract) =>
            contract.id === contractId || contract.contractNumber === contractId
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
      <div className="border-b border-gray-300">
        <h1 className="text-xl font-bold text-center mb-3">
          Contract {contractData.contractNumber || contractId}
        </h1>
      </div>
      <Contract contract={contractData} />
    </div>
  );
};

export default ContractDetailsPage;

// "use client";
// import { Contract as TContract } from "@/types/types";
// import { useParams } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { MdOutlineEdit } from "react-icons/md";

// const ContractDetailsPage = () => {
//   const [contractData, setContractData] = useState<TContract | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const { contractId } = useParams<{ contractId: string }>();

//   useEffect(() => {
//     const fetchContractData = async () => {
//       try {
//         setLoading(true);
//         const response = await fetch("/contracts.json");
//         const contracts: TContract[] = await response.json();

//         const foundContract = contracts.find(
//           (contract) =>
//             contract.id === contractId || contract.contractNumber === contractId
//         );

//         if (foundContract) {
//           setContractData(foundContract);
//         } else {
//           setError(`Contract with ID ${contractId} not found`);
//         }
//       } catch (err) {
//         setError("Failed to load contract data");
//         console.error("Error fetching contract:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchContractData();
//   }, [contractId]);

//   if (loading) {
//     return <div className="mt-6 text-center">Loading contract details...</div>;
//   }

//   if (error) {
//     return <div className="mt-6 text-center text-red-500">{error}</div>;
//   }

//   if (!contractData) {
//     return <div className="mt-6 text-center">No contract data available</div>;
//   }

//   return (
//     <div>
//       <div className="border-b border-gray-300 py-10">
//         <div className="mx-auto max-w-6xl">
//           <p className="text-xl font-semibold">
//             Contract {contractData.contractNumber || contractId}
//           </p>
//         </div>
//       </div>

//       <div className="my-10 text-center">
//         <p className="text-lg">
//           {contractData.commodity} - {contractData.commoditySeason}
//         </p>
//       </div>

//       <div className="flex flex-col items-center mx-auto max-w-6xl gap-6 xl:overflow-y-scroll xl:h-[40rem]">
//         {/* Main Contract Details */}
//         <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Left Column */}
//           <div className="flex flex-col border border-gray-300 rounded-md">
//             <div className="flex border-b border-gray-300 w-full">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Contract Number
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.contractNumber || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Contract Date
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.contractDate || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Commodity
//               </div>
//               <div className="w-1/2 p-3">{contractData.commodity || "N/A"}</div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Season</div>
//               <div className="w-1/2 p-3">
//                 {contractData.commoditySeason || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Tonnes</div>
//               <div className="w-1/2 p-3">{contractData.tonnes || "N/A"}</div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Grade</div>
//               <div className="w-1/2 p-3">{contractData.grade || "N/A"}</div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Weights
//               </div>
//               <div className="w-1/2 p-3">{contractData.weights || "N/A"}</div>
//             </div>
//             <div className="flex">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Price (ex GST)
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.priceExGst || "N/A"}
//               </div>
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="flex flex-col border border-gray-300 rounded-md">
//             <div className="flex border-b border-gray-300 w-full">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Delivery Period
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.deliveryPeriod || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Delivery Option
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.deliveryOption || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Payment Terms
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.paymentTerms || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Freight
//               </div>
//               <div className="w-1/2 p-3">{contractData.freight || "N/A"}</div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Certification
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.certificationScheme || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Broker</div>
//               <div className="w-1/2 p-3">{contractData.broker || "N/A"}</div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Broker Rate
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.brokerRate || "N/A"}
//               </div>
//             </div>
//             <div className="flex">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Status</div>
//               <div className="w-1/2 p-3">{contractData.status || "N/A"}</div>
//             </div>
//           </div>
//         </div>

//         {/* Buyer Information */}
//         <div className="w-full border border-gray-300 rounded-md">
//           <div className="border-b border-gray-300 p-3 bg-gray-50">
//             <p className="font-semibold">Buyer Information</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2">
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Buyer Name
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.buyer?.name || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">ABN</div>
//               <div className="w-1/2 p-3">
//                 {contractData.buyer?.abn || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Office Address
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.buyer?.officeAddress || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Contact Name
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.buyer?.contactName || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Email</div>
//               <div className="w-1/2 p-3">
//                 {contractData.buyer?.email || "N/A"}
//               </div>
//             </div>
//             <div className="flex">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Phone</div>
//               <div className="w-1/2 p-3">
//                 {contractData.buyer?.phone || "N/A"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Seller Information */}
//         <div className="w-full border border-gray-300 rounded-md">
//           <div className="border-b border-gray-300 p-3 bg-gray-50">
//             <p className="font-semibold">Seller Information</p>
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2">
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Legal Name
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.seller?.sellerLegalName || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Office Address
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.seller?.sellerOfficeAddress || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">ABN</div>
//               <div className="w-1/2 p-3">
//                 {contractData.seller?.sellerABN || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Main NGR
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.seller?.sellerMainNGR || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Contact Name
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.seller?.sellerContactName || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Email</div>
//               <div className="w-1/2 p-3">
//                 {contractData.seller?.sellerEmail || "N/A"}
//               </div>
//             </div>
//             <div className="flex">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Phone</div>
//               <div className="w-1/2 p-3">
//                 {contractData.seller?.sellerPhoneNumber || "N/A"}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Additional Information */}
//         <div className="w-full border border-gray-300 rounded-md">
//           <div className="border-b border-gray-300 p-3 bg-gray-50">
//             <p className="font-semibold">Additional Information</p>
//           </div>
//           <div className="grid grid-cols-1">
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Special Conditions
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.specialCondition || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Terms & Conditions
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.termsAndConditions || "N/A"}
//               </div>
//             </div>
//             <div className="flex border-b border-gray-300">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Notes</div>
//               <div className="w-1/2 p-3">{contractData.notes || "N/A"}</div>
//             </div>
//             <div className="flex">
//               <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
//                 Attachments
//               </div>
//               <div className="w-1/2 p-3">
//                 {contractData.attachments ? (
//                   <div className="flex flex-col gap-1">
//                     <a
//                       href={contractData.attachments.sellersContract}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Seller's Contract
//                     </a>
//                     <a
//                       href={contractData.attachments.buyersContract}
//                       className="text-blue-600 hover:underline"
//                     >
//                       Buyer's Contract
//                     </a>
//                   </div>
//                 ) : (
//                   "N/A"
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Edit Button */}
//         <div className="mt-10 w-full flex justify-center">
//           <button className="py-2 px-5 bg-[#2A5D36] text-white rounded flex items-center gap-2">
//             <MdOutlineEdit className="text-lg" />
//             Edit Contract
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ContractDetailsPage;
