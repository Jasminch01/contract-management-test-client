"use client";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { IoDocumentText } from "react-icons/io5";
import ExportContractPdf from "./ExportContractPdf";
import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
interface Contract {
  _id: string;
  createdAt: string;
  contractNumber: string;
  season: string;
  seller: {
    mainNgr?: string;
    legalName?: string;
    email?: string;
  };
  grade: string;
  tonnes: number;
  buyer: {
    name?: string;
    email?: string;
  };
  deliveryDestination: string;
  destination?: string; // Additional field that might be used
  deliveryOption?: string;
  priceExGST: number;
  status: string;
  notes?: string;
  isDeleted?: boolean;
}
interface PdfExportButtonProps {
  selectedRows: Contract[];
}

const PdfExportButton = ({ selectedRows }: PdfExportButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleMultipleExport = async () => {
    setLoading(true);
    if (selectedRows.length <= 1) return;

    try {
      const zip = new JSZip();

      await Promise.all(
        selectedRows.map(async (contract) => {
          const blob = await pdf(
            <ExportContractPdf contracts={[contract]} />
          ).toBlob();
          zip.file(`contract_${contract.contractNumber}.pdf`, blob);
        })
      );

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `contracts_${new Date().toISOString().slice(0, 10)}.zip`);
    } catch (error) {
      console.error("Error generating ZIP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSinglePdfExport = async () => {
    if (selectedRows.length !== 1) return;
    setLoading(true);

    try {
      // Generate PDF blob
      const blob = await pdf(
        <ExportContractPdf contracts={selectedRows} />
      ).toBlob();

      // Download the file
      saveAs(blob, `contract_${selectedRows[0].contractNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedRows.length > 1) {
    return (
      <button
        onClick={handleMultipleExport}
        disabled={selectedRows.length === 0 || loading}
        className={`w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
          selectedRows.length > 0 && !loading
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-50 pointer-events-none"
        }`}
      >
        <IoDocumentText />
        {loading ? `Generating PDF...` : `Export as PDF`}
      </button>
    );
  }

  return (
    <button
      onClick={handleSinglePdfExport}
      disabled={selectedRows.length !== 1 || loading}
      className={`w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
        selectedRows.length === 1 && !loading
          ? "cursor-pointer"
          : "cursor-not-allowed opacity-50 pointer-events-none"
      }`}
    >
      <IoDocumentText />
      {loading ? "Generating PDF..." : "Export as PDF"}
    </button>
  );
};

export default PdfExportButton;
