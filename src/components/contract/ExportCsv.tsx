/* eslint-disable @typescript-eslint/ban-ts-comment */
import { CSVLink } from "react-csv";
import { IoDocumentText } from "react-icons/io5";
import { Contract } from "@/types/types";

interface ExportCSVButtonProps {
  selectedRows: Contract[];
}

const ExportCsv: React.FC<ExportCSVButtonProps> = ({ selectedRows }) => {
  const headers = [
    { label: "CONTRACT NUMBER", key: "contractNumber" },
    { label: "SEASON", key: "commoditySeason" },
    { label: "NGR", key: "seller.sellerMainNGR" },
    { label: "GROWER", key: "seller.sellerLegalName" },
    { label: "TONNES", key: "tonnes" },
    { label: "BUYER", key: "buyer.name" },
    { label: "DESTINATION", key: "buyer.officeAddress" },
    {
      label: "CONTRACT PRICE",
      key: "priceExGst",
      format: (value: number) => `A$${value.toFixed(2)}`,
    },
    { label: "STATUS", key: "status" },
    { label: "NOTES", key: "notes" },
  ];
  return (
    // @ts-expect-error
    <CSVLink
      data={selectedRows}
      headers={headers}
      filename={`contracts-export-${new Date().toISOString().slice(0, 10)}.csv`}
      className={`w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
        selectedRows.length > 0
          ? "cursor-pointer"
          : "cursor-not-allowed opacity-50 pointer-events-none"
      }`}
      target="_blank"
    >
      <IoDocumentText className="text-gray-700" />
      <span>Export as CSV</span>
    </CSVLink>
  );
};

export default ExportCsv;
