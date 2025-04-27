"use client";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Contract } from "@/types/types";
import { IoDocumentText } from "react-icons/io5";
import ExportContractPdf from "./ExportContractPdf";
import { useState } from "react";

interface PdfExportButtonProps {
  selectedRows: Contract[];
}

const PdfExportButton = ({ selectedRows }: PdfExportButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleMultipleExport = async () => {
    setLoading(true);
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
      setLoading(false);
    }
  };

  const handleSinglePdfExport = async () => {
    if (selectedRows.length !== 1) return;
    setLoading(true);

    try {
      // Dynamically import with proper error handling
      const [PDFLib, ExportContractPdf, FileSaver] = await Promise.all([
        import("@react-pdf/renderer").catch(() => null),
        import("./ExportContractPdf").catch(() => null),
        import("file-saver").catch(() => null),
      ]);

      if (!PDFLib || !ExportContractPdf?.default || !FileSaver?.saveAs) {
        throw new Error("Required libraries failed to load");
      }

      // Create PDF instance
      const PDFDocument = PDFLib.pdf;
      const blob = await PDFDocument(
        <ExportContractPdf.default contracts={selectedRows} />
      ).toBlob();

      // Save the file
      FileSaver.saveAs(blob, `contract_${selectedRows[0].contractNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Optionally show user feedback
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
