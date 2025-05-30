import { Contract as Tcontract } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { MdOutlineEdit } from "react-icons/md";
interface ContractProps {
  contract: Tcontract;
}
const Contract: React.FC<ContractProps> = ({ contract }) => {
  const [preview, setPreview] = useState(false);
  if (preview) {
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
                <p>{contract.buyer.name}</p>
                <p>Top Box Stock</p>
                <p>Minimum VIC, 3004</p>
                <p>{contract.buyer.officeAddress}</p>
                <p>{contract.buyer.email}</p>
              </div>

              <div className="pb-1 space-y-2">
                <h2 className="font-bold text-sm">Seller</h2>
                <p>{contract.seller.sellerLegalName}</p>
                <p>{contract.seller.sellerOfficeAddress}</p>
                <p>{contract.seller.sellerContactName}</p>
                <p>{contract.seller.sellerEmail}</p>
              </div>
            </div>
            {/* Full-width Broker Ref section with borders */}
            <div>
              <div className="w-full py-2 mb-4 border-b border-t  border-gray-300">
                <div className="flex px-20">
                  <span className="w-1/4 font-semibold">Broker Ref:</span>
                  <span className="w-1/4">{contract.brokerReference}</span>
                  <span className="w-1/4 font-semibold">Contract Date:</span>
                  <span className="w-1/4">{contract.contractDate}</span>
                </div>
              </div>
            </div>

            {/* Buyer/Seller Section */}
            <div className="pl-20 pr-10">
              <div className="space-y-2 text-xs">
                <div className="flex pb-1">
                  <span className="w-1/4 font-semibold">Commodity:</span>
                  <span className="w-3/4">{contract.commodity}</span>
                </div>

                <div className="flex pb-1">
                  <span className="w-1/4 font-semibold">Season:</span>
                  <span className="w-3/4">{contract.commoditySeason}</span>
                </div>

                <div className="flex pb-1">
                  <span className="w-1/4 font-semibold">Quality:</span>
                  <span className="w-3/4">H1 AS PER GTA CSG-101 STANDARDS</span>
                </div>

                <div className="flex pb-1">
                  <span className="w-1/4 font-semibold">Quantity:</span>
                  <span className="w-3/4">
                    20.66 METRIC TONNES - NIL TOLERANCE
                  </span>
                </div>

                <div className="flex pb-1">
                  <span className="w-1/4 font-semibold">Price:</span>
                  <span className="w-3/4">
                    A${contract.priceExGst} PER TONNE IN DISPOT YITTERM,
                    ROCKVORTHY
                  </span>
                </div>

                <div className="flex pb-1">
                  <span className="w-1/4 font-semibold">Delivery Period:</span>
                  <span className="w-3/4">{contract.deliveryOption}</span>
                </div>

                <div className="flex pb-1">
                  <span className="w-1/4 font-semibold">Payment:</span>
                  <span className="w-3/4">
                    5 DARS END OF WEEK OF CULVERT SANDAR IS END OF WEED
                  </span>
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
                    WHEN NOT IN CONFLICT WITH THE ABOVE CONDITIONS THIS CONTRACT
                    EXPRESSLY INCORPORATES THE TERMS & CONDITIONS OF THE GTA NO
                    3 CONTRACT INCLUDING THE GTA TRADE RULES AND DISPURE
                    RESOLUTION RULES
                  </p>
                </div>

                <div className="flex pb-1">
                  <span className="w-1/4 font-semibold">
                    Special Conditions:
                  </span>
                  <span className="w-3/4 uppercase">
                    {contract.specialCondition}
                  </span>
                </div>

                <div className="pb-1">
                  <div className="font-semibold mb-1">Brokerage:</div>
                  <p className="text-xs">
                    AT SELLERS COST AT A$1.00 PER TONNE (EXCLUSIVE OF GST)
                    INVOICE TO SELLER TO BE FORWARDED ON SEPARATELY TO THIS
                    CONTRACT
                  </p>
                </div>
              </div>

              {/* Footer Note */}
              <div className="mt-4 text-xs italic">
                <p>
                  Growth Grain Services as broker does not guarentee the
                  performance of this contract. Both the buyer and the seller
                  are bound by the above contract and mentioned GTA contracts to
                  execute the contract. Seller is resposible for any applicable
                  levies/royalties
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="my-10 text-center">
        <p className="text-lg">
          {contract.commodity} - {contract.commoditySeason}
        </p>
      </div>

      <div className="flex flex-col items-center mx-auto max-w-6xl gap-6 xl:overflow-y-scroll xl:h-[40rem]">
        {/* Main Contract Details */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="flex flex-col border border-gray-300 rounded-md">
            <div className="flex border-b border-gray-300 w-full">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Contract Number
              </div>
              <div className="w-1/2 p-3">
                {contract.contractNumber || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Contract Date
              </div>
              <div className="w-1/2 p-3">{contract.contractDate || "N/A"}</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Commodity
              </div>
              <div className="w-1/2 p-3">{contract.commodity || "N/A"}</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Season</div>
              <div className="w-1/2 p-3">
                {contract.commoditySeason || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Tolerance</div>
              <div className="w-1/2 p-3">
                {contract.tolerance || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Tonnes</div>
              <div className="w-1/2 p-3">{contract.tonnes || "N/A"}</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Grade</div>
              <div className="w-1/2 p-3">{contract.grade || "N/A"}</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Weights
              </div>
              <div className="w-1/2 p-3">{contract.weights || "N/A"}</div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Price (ex GST)
              </div>
              <div className="w-1/2 p-3">{contract.priceExGst || "N/A"}</div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col border border-gray-300 rounded-md">
            <div className="flex border-b border-gray-300 w-full">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Delivery Period
              </div>
              <div className="w-1/2 p-3">
                {contract.deliveryPeriod || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Delivery Option
              </div>
              <div className="w-1/2 p-3">
                {contract.deliveryOption || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Payment Terms
              </div>
              <div className="w-1/2 p-3">{contract.paymentTerms || "N/A"}</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Freight
              </div>
              <div className="w-1/2 p-3">{contract.freight || "N/A"}</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Certification
              </div>
              <div className="w-1/2 p-3">
                {contract.certificationScheme || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Broker</div>
              <div className="w-1/2 p-3">{contract.broker || "N/A"}</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Brokerage Payable By</div>
              <div className="w-1/2 p-3">{contract.broker || "N/A"}</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Broker Rate
              </div>
              <div className="w-1/2 p-3">{contract.brokerRate || "N/A"}</div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Status</div>
              <div className="w-1/2 p-3">{contract.status || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Buyer Information */}
        <div className="w-full border border-gray-300 rounded-md">
          <div className="border-b border-gray-300 p-3 bg-gray-50">
            <p className="font-semibold">Buyer Information</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Buyer Name
              </div>
              <div className="w-1/2 p-3">{contract.buyer?.name || "N/A"}</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">ABN</div>
              <div className="w-1/2 p-3">{contract.buyer?.abn || "N/A"}</div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Office Address
              </div>
              <div className="w-1/2 p-3">
                {contract.buyer?.officeAddress || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Contact Name
              </div>
              <div className="w-1/2 p-3">
                {contract.buyer?.contactName || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Email</div>
              <div className="w-1/2 p-3">{contract.buyer?.email || "N/A"}</div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Phone</div>
              <div className="w-1/2 p-3">{contract.buyer?.phone || "N/A"}</div>
            </div>
          </div>
        </div>

        {/* Seller Information */}
        <div className="w-full border border-gray-300 rounded-md">
          <div className="border-b border-gray-300 p-3 bg-gray-50">
            <p className="font-semibold">Seller Information</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Legal Name
              </div>
              <div className="w-1/2 p-3">
                {contract.seller?.sellerLegalName || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Office Address
              </div>
              <div className="w-1/2 p-3">
                {contract.seller?.sellerOfficeAddress || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">ABN</div>
              <div className="w-1/2 p-3">
                {contract.seller?.sellerABN || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Main NGR
              </div>
              <div className="w-1/2 p-3">
                {contract.seller?.sellerMainNGR || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Contact Name
              </div>
              <div className="w-1/2 p-3">
                {contract.seller?.sellerContactName || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Email</div>
              <div className="w-1/2 p-3">
                {contract.seller?.sellerEmail || "N/A"}
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Phone</div>
              <div className="w-1/2 p-3">
                {contract.seller?.sellerPhoneNumber || "N/A"}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="w-full border border-gray-300 rounded-md">
          <div className="border-b border-gray-300 p-3 bg-gray-50">
            <p className="font-semibold">Additional Information</p>
          </div>
          <div className="grid grid-cols-1">
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Special Conditions
              </div>
              <div className="w-1/2 p-3">
                {contract.specialCondition || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Terms & Conditions
              </div>
              <div className="w-1/2 p-3">
                {contract.termsAndConditions || "N/A"}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Notes</div>
              <div className="w-1/2 p-3">{contract.notes || "N/A"}</div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Attachments
              </div>
              <div className="w-1/2 p-3">
                {contract.attachments ? (
                  <div className="flex flex-col gap-1">
                    <a
                      href={contract.attachments.sellersContract}
                      className="text-blue-600 hover:underline"
                    >
                      Seller&apos;s Contract
                    </a>
                    <a
                      href={contract.attachments.buyersContract}
                      className="text-blue-600 hover:underline"
                    >
                      Buyer&apos;s Contract
                    </a>
                  </div>
                ) : (
                  "N/A"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <div className="mt-10 w-full flex justify-center gap-5">
          <Link href={`/contract-management/edit/${contract.id}`}>
            <button className="cursor-pointer py-2 px-5 bg-[#2A5D36] text-white hover:bg-[#1e4728]  rounded flex items-center gap-2">
              <MdOutlineEdit className="text-lg" />
              Edit Contract
            </button>
          </Link>
          <button
            type="button"
            onClick={() => setPreview(true)}
            className="cursor-pointer py-2 px-5 bg-[#2A5D36] hover:bg-[#1e4728] text-white rounded flex items-center gap-2"
          >
            Preview Contract
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contract;
