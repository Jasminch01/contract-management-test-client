/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-nocheck

import { contracts, initialBuyers, sellers } from "@/data/data";
import { Contract as Tcontract } from "@/types/types";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  MdArrowDropDown,
  MdCancel,
  MdKeyboardBackspace,
  MdSave,
} from "react-icons/md";
import { addDays } from "date-fns";
interface ContractProps {
  contract: Tcontract;
}

const EditableContract: React.FC<ContractProps> = ({
  contract: initialContract,
}) => {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    null,
    null,
  ]);
  const [preview, setPreview] = useState(false);
  const [contract, setContract] = useState(initialContract);
  const [hasChanges, setHasChanges] = useState(false);
  const [showBuyerDropdown, setShowBuyerDropdown] = useState(false);
  const [showSellerDropdown, setShowSellerDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showBrokeragePayableDropdown, setShowBrokeragePayableDropdown] =
    useState(false);
  const router = useRouter();
  const [startDate, endDate] = dateRange;
  const statusOptions: ContractStatus[] = [
    "incompleted",
    "completed",
    "invoiced",
  ];

  const brokeragePayableOptions = [
    { name: "Buyer", value: "Buyer" },
    { name: "Seller", value: "Seller" },
    { name: "No Brokerage Payable", value: "No Brokerage Payable" },
  ];

  const handleBrokeragePayableSelect = (selectedOption) => {
    setContract((prev) => ({
      ...prev,
      brokeragePayableBy: selectedOption.value,
    }));
    setShowBrokeragePayableDropdown(false);
    setHasChanges(true);
  };

  const handleBuyerSelect = (selectedBuyer) => {
    setContract((prev) => ({
      ...prev,
      buyer: selectedBuyer,
    }));
    setShowBuyerDropdown(false);
    setHasChanges(true);
  };
  const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/contract-management");
  };
  // Update seller information when a new seller is selected
  const handleSellerSelect = (selectedSeller) => {
    setContract((prev) => ({
      ...prev,
      seller: selectedSeller,
    }));
    setShowSellerDropdown(false);
    setHasChanges(true);
  };

  // Update status when a new status is selected
  const handleStatusSelect = (selectedStatus) => {
    setContract((prev) => ({
      ...prev,
      status: selectedStatus,
    }));
    setShowStatusDropdown(false);
    setHasChanges(true);
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    nestedObject?: string
  ) => {
    const { value } = e.target;
    setContract((prev) => {
      const newContract = { ...prev };
      if (nestedObject) {
        newContract[nestedObject] = {
          ...newContract[nestedObject],
          [field]: value,
        };
      } else {
        newContract[field] = value;
      }
      return newContract;
    });
    setHasChanges(true);
  };

  const handleDateChange = (update: [Date | null, Date | null]) => {
    setDateRange(update);

    // Convert date range to string for storage in formData
    if (update[0] && update[1]) {
      const formattedDateRange = `${update[0].toLocaleDateString()} - ${update[1].toLocaleDateString()}`;
      setFormData((prev) => ({
        ...prev,
        deliveryPeriod: formattedDateRange,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        deliveryPeriod: "",
      }));
    }
  };

  const handleSave = () => {
    try {
      const index = contracts.findIndex(
        (contract) => contract.id === contract.id
      );
      if (index !== -1) {
        contracts[index] = { ...contract };
      }
    } catch (err) {
      console.error("Error saving buyer:", err);
    }
    console.log("Saving changes:", contract);
    setHasChanges(false);
    router.push("/contract-management");
  };

  const handleCancel = () => {
    setContract(initialContract);
    setHasChanges(false);
  };

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
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setPreview(false)}
            className="py-2 px-5 bg-[#2A5D36] text-white rounded"
          >
            Back to Edit
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="my-10 grid grid-cols-3 items-center">
        <button
          type="button"
          onClick={handleBack}
          className="flex items-center justify-start ml-20 cursor-pointer"
        >
          <MdKeyboardBackspace size={24} />
        </button>
        <p className="text-lg text-center col-span-1">
          {contract.commodity} - {contract.commoditySeason}
        </p>
        <div></div> {/* Empty div to balance the grid */}
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
                <input
                  type="text"
                  value={contract.contractNumber || ""}
                  onChange={(e) => handleChange(e, "contractNumber")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Contract Date
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.contractDate || ""}
                  onChange={(e) => handleChange(e, "contractDate")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Commodity
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.commodity || ""}
                  onChange={(e) => handleChange(e, "commodity")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Season</div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.commoditySeason || ""}
                  onChange={(e) => handleChange(e, "commoditySeason")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Tonnes</div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.tonnes || ""}
                  onChange={(e) => handleChange(e, "tonnes")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Grade</div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.grade || ""}
                  onChange={(e) => handleChange(e, "grade")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Weights
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.weights || ""}
                  onChange={(e) => handleChange(e, "weights")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Price (ex GST)
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.priceExGst || ""}
                  onChange={(e) => handleChange(e, "priceExGst")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Deliverd Destination
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.destination|| ""}
                  onChange={(e) => handleChange(e, "destination")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col border border-gray-300 rounded-md">
            <div className="flex border-b border-gray-300 w-full">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Delivery Period
              </div>
              <div className="w-1/2 p-3">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={handleDateChange}
                  isClearable={true}
                  placeholderText="Select date range"
                  className="mt-1 w-full xl:w-[250px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
                  calendarClassName="w-full sm:w-auto" // Makes calendar responsive
                  dateFormat="MMM d, yyyy"
                  minDate={new Date()}
                  maxDate={addDays(new Date(), 365)}
                  shouldCloseOnSelect={false}
                  selectsDisabledDaysInRange
                  required
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Delivery Option
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.deliveryOption || ""}
                  onChange={(e) => handleChange(e, "deliveryOption")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Payment Terms
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.paymentTerms || ""}
                  onChange={(e) => handleChange(e, "paymentTerms")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Freight
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.freight || ""}
                  onChange={(e) => handleChange(e, "freight")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Certification
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.certificationScheme || ""}
                  onChange={(e) => handleChange(e, "certificationScheme")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Broker</div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.broker || ""}
                  onChange={(e) => handleChange(e, "broker")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Broker Rate
              </div>
              <div className="w-1/2 p-3">
                <input
                  type="text"
                  value={contract.brokerRate || ""}
                  onChange={(e) => handleChange(e, "brokerRate")}
                  className="w-full border border-gray-300 p-1 rounded"
                />
              </div>
            </div>

            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Brokerage Payable By
              </div>
              <div className="w-1/2 p-3 relative">
                <div
                  className="w-full border border-gray-300 p-1 rounded flex justify-between items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBrokeragePayableDropdown(
                      !showBrokeragePayableDropdown
                    );
                  }}
                >
                  <span>{contract.brokeragePayableBy || "Select Option"}</span>
                  <MdArrowDropDown className="text-xl" />
                </div>
                {showBrokeragePayableDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                    {brokeragePayableOptions.map((option) => (
                      <div
                        key={option.value}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBrokeragePayableSelect(option);
                        }}
                      >
                        {option.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Status</div>
              <div className="w-1/2 p-3 relative">
                <div
                  className="w-full border border-gray-300 p-1 rounded flex justify-between items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStatusDropdown(!showStatusDropdown);
                  }}
                >
                  <span className="capitalize">{contract.status || ""}</span>
                  <MdArrowDropDown className="text-xl" />
                </div>
                {showStatusDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg">
                    {statusOptions.map((status) => (
                      <div
                        key={status}
                        className="p-2 hover:bg-gray-100 cursor-pointer capitalize"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusSelect(status);
                        }}
                      >
                        {status}
                      </div>
                    ))}
                  </div>
                )}
              </div>
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
              <div className="w-1/2 p-3 relative">
                <div
                  className="w-full border border-gray-300 p-1 rounded flex justify-between items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowBuyerDropdown(!showBuyerDropdown);
                  }}
                >
                  <span>{contract.buyer?.name || "Select Buyer"}</span>
                  <MdArrowDropDown className="text-xl" />
                </div>
                {showBuyerDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
                    {initialBuyers.map((buyer) => (
                      <div
                        key={buyer.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyerSelect(buyer);
                        }}
                      >
                        {buyer.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">ABN</div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {contract.buyer?.abn || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Office Address
              </div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {contract.buyer?.officeAddress || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Contact Name
              </div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {contract.buyer?.contactName || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Email</div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {contract.buyer?.email || ""}
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Phone</div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {contract.buyer?.phone || ""}
                </div>
              </div>
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
              <div className="w-1/2 p-3 relative">
                <div
                  className="w-full border border-gray-300 p-1 rounded flex justify-between items-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSellerDropdown(!showSellerDropdown);
                  }}
                >
                  <span>
                    {contract.seller?.sellerLegalName || "Select Seller"}
                  </span>
                  <MdArrowDropDown className="text-xl" />
                </div>
                {showSellerDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded shadow-lg max-h-48 overflow-y-auto">
                    {sellers.map((seller) => (
                      <div
                        key={seller.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSellerSelect(seller);
                        }}
                      >
                        {seller.sellerLegalName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Office Address
              </div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {contract.seller?.sellerOfficeAddress || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">ABN</div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {contract.seller?.sellerABN || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Main NGR
              </div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {contract.seller?.sellerMainNGR || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Contact Name
              </div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {contract.seller?.sellerContactName || ""}
                </div>
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Email</div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {contract.seller?.sellerEmail || ""}
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Phone</div>
              <div className="w-1/2 p-3">
                <div className="w-full p-1 rounded bg-gray-50">
                  {contract.seller?.sellerPhoneNumber || ""}
                </div>
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
                <textarea
                  value={contract.specialCondition || ""}
                  onChange={(e) => handleChange(e, "specialCondition")}
                  className="w-full border border-gray-300 p-1 rounded"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">
                Terms & Conditions
              </div>
              <div className="w-1/2 p-3">
                <textarea
                  value={contract.termsAndConditions || ""}
                  onChange={(e) => handleChange(e, "termsAndConditions")}
                  className="w-full border border-gray-300 p-1 rounded"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex border-b border-gray-300">
              <div className="w-1/2 p-3 text-[#1A1A1A] font-medium">Notes</div>
              <div className="w-1/2 p-3">
                <textarea
                  value={contract.notes || ""}
                  onChange={(e) => handleChange(e, "notes")}
                  className="w-full border border-gray-300 p-1 rounded"
                  rows={3}
                />
              </div>
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

        {/* Action Buttons - Only show when there are changes */}
        <div className="mt-10 w-full flex justify-center gap-5 sticky bottom-0 bg-white py-4">
          {/* Always show Preview button */}
          <button
            type="button"
            onClick={() => setPreview(true)}
            className="py-2 px-5 bg-[#2A5D36] text-white rounded flex items-center gap-2"
          >
            Preview Contract
          </button>

          {/* Only show Save and Cancel when there are changes */}
          {hasChanges && (
            <>
              <button
                onClick={handleSave}
                className="py-2 px-5 bg-[#2A5D36] text-white rounded flex items-center gap-2 hover:bg-[#1e4a2a] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <MdSave className="text-lg" />
                Save Changes
              </button>
              <button
                onClick={handleCancel}
                className="py-2 px-5 bg-gray-500 text-white rounded flex items-center gap-2 hover:bg-gray-600 transition-colors"
              >
                <MdCancel className="text-lg" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableContract;
