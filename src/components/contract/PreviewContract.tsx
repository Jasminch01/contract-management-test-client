import { Buyer, Seller, TContract } from "@/types/types";
import Image from "next/image";
// Preview Component
interface PreviewContractProps {
  contract: TContract;
  selectedBuyer: Buyer | undefined;
  selectedSeller: Seller | undefined;
  onBackToEdit: () => void;
}

const PreviewContract: React.FC<PreviewContractProps> = ({
  contract,
  selectedBuyer,
  selectedSeller,
  onBackToEdit,
}) => {
  return (
    <div className="max-w-3xl mx-auto mt-5">
      <div className="border border-gray-300">
        <div className="text-sm bg-white py-10">
          {/* Header */}
          <div className="mb-4 border-b border-gray-300 pb-5 flex items-center space-x-20 pl-20">
            <div>
              <Image
                src={"/Original.png"}
                alt="growth-grain-logo"
                width={50}
                height={50}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold">GROWTH GRAIN SERVICES</h1>
              <p className="text-xs">ABN 64 157 832 216</p>
            </div>
          </div>
          <div className="mb-4 grid grid-cols-2 gap-2 text-xs px-20">
            <div className="pb-1 space-y-2">
              <h2 className="font-bold text-sm">Buyer</h2>
              <p>{selectedBuyer?.name}</p>
              <p>Top Box Stock</p>
              <p>Minimum VIC, 3004</p>
              <p>{selectedBuyer?.officeAddress}</p>
              <p>{selectedBuyer?.email}</p>
            </div>

            <div className="pb-1 space-y-2">
              <h2 className="font-bold text-sm">Seller</h2>
              <p>{selectedSeller?.legalName}</p>
              <p>{selectedSeller?.address}</p>
              <p>{selectedSeller?.contactName}</p>
              <p>{selectedSeller?.email}</p>
            </div>
          </div>
          {/* Full-width Broker Ref section with borders */}
          <div>
            <div className="w-full py-2 mb-4 border-b border-t  border-gray-300">
              <div className="flex px-20">
                <span className="w-1/4 font-semibold">Broker Ref:</span>
                <span className="w-1/4">
                  {contract.sellerContractReference}
                </span>
                <span className="w-1/4 font-semibold">Contract Date:</span>
                <span className="w-1/4">{contract.createdAt}</span>
              </div>
            </div>
          </div>

          {/* Contract Details */}
          <div className="pl-20 pr-10">
            <div className="space-y-2 text-xs">
              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Commodity:</span>
                <span className="w-3/4">{contract.commodity}</span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Season:</span>
                <span className="w-3/4">{contract.season}</span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Quality:</span>
                <span className="w-3/4">H1 AS PER GTA CSG-101 STANDARDS</span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Quantity:</span>
                <span className="w-3/4">
                  {contract.tonnes} METRIC TONNES - {contract.tolerance}
                </span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Price:</span>
                <span className="w-3/4">A${contract.priceExGST} PER TONNE</span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Delivery Period:</span>
                <span className="w-3/4">{contract.deliveryOption}</span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Payment:</span>
                <span className="w-3/4">{contract.paymentTerms}</span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Freight:</span>
                <span className="w-3/4">{contract.freight}</span>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Weight:</span>
                <span className="w-3/4">{contract.weights}</span>
              </div>

              <div className="pb-1">
                <div className="font-semibold mb-1">Terms & Conditions:</div>
                <p className="text-xs">
                  {contract.termsAndConditions ||
                    "WHEN NOT IN CONFLICT WITH THE ABOVE CONDITIONS THIS CONTRACT EXPRESSLY INCORPORATES THE TERMS & CONDITIONS OF THE GTA NO 3 CONTRACT INCLUDING THE GTA TRADE RULES AND DISPUTE RESOLUTION RULES"}
                </p>
              </div>

              <div className="flex pb-1">
                <span className="w-1/4 font-semibold">Special Conditions:</span>
                <span className="w-3/4 uppercase">
                  {contract.specialCondition}
                </span>
              </div>

              <div className="pb-1">
                <div className="font-semibold mb-1">Brokerage:</div>
                <p className="text-xs">
                  AT{" "}
                  {contract.brokeragePayableBy === "Seller"
                    ? "SELLERS"
                    : contract.brokeragePayableBy === "Buyer"
                    ? "BUYERS"
                    : "NO"}{" "}
                  COST AT A${contract.brokerRate || "1.00"} PER TONNE (EXCLUSIVE
                  OF GST)
                  {contract.brokeragePayableBy !== "No Brokerage Payable" &&
                    " INVOICE TO BE FORWARDED ON SEPARATELY TO THIS CONTRACT"}
                </p>
              </div>
            </div>

            {/* Footer Note */}
            <div className="mt-4 text-xs italic">
              <p>
                Growth Grain Services as broker does not guarantee the
                performance of this contract. Both the buyer and the seller are
                bound by the above contract and mentioned GTA contracts to
                execute the contract. Seller is responsible for any applicable
                levies/royalties
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center">
        <button
          onClick={onBackToEdit}
          className="py-2 px-5 bg-[#2A5D36] text-white rounded"
        >
          Back to Edit
        </button>
      </div>
    </div>
  );
};

export default PreviewContract;
