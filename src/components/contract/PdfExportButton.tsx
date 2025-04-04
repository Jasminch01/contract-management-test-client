// components/contract/PdfExportButton.tsx
"use client";

import dynamic from "next/dynamic";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Contract } from "@/types/types";
import { IoDocumentText } from "react-icons/io5";
import ExportContractPdf from "./ExportContractPdf";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  { ssr: false }
);

interface PdfExportButtonProps {
  selectedRows: Contract[];
}

const PdfExportButton = ({ selectedRows }: PdfExportButtonProps) => {
  const handleMultipleExport = async () => {
    if (selectedRows.length <= 1) return;

    try {
      const { pdf } = await import("@react-pdf/renderer");
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
    }
  };

  if (selectedRows.length === 0) {
    return (
      <button
        className={`w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
          selectedRows.length > 0
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-50 pointer-events-none"
        }`}
      >
        <IoDocumentText />
        Export as PDF
      </button>
    );
  }

  if (selectedRows.length > 1) {
    return (
      <button
        onClick={handleMultipleExport}
        className={`w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
          selectedRows.length > 0
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-50 pointer-events-none"
        }`}
      >
        <IoDocumentText />
        Export as PDF
      </button>
    );
  }

  return (
    <PDFDownloadLink
      document={<ExportContractPdf contracts={selectedRows} />}
      fileName={`contract_${selectedRows[0].contractNumber}.pdf`}
      className="w-full md:w-auto"
    >
      <button
        className={`w-full md:w-auto px-3 py-2 border border-gray-200 rounded flex items-center justify-center gap-2 text-sm hover:bg-gray-100 transition-colors ${
          selectedRows.length > 0
            ? "cursor-pointer"
            : "cursor-not-allowed opacity-50 pointer-events-none"
        }`}
      >
        <IoDocumentText />
        Export as PDF
      </button>
    </PDFDownloadLink>
  );
};

export default PdfExportButton;
