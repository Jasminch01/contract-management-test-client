
import { Contract } from "@/types/types";
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image as PdfImage,
} from "@react-pdf/renderer";


const contractPdfStyles = StyleSheet.create({
  page: {
    fontSize: 14,
    fontFamily: "Helvetica",
    height: "100%",
  },
  container: {
    paddingTop: 30,
    height: "100%", // Take full available height
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flexGrow: 1, // Grow to fill available space
    paddingTop: 10,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 50,
  },
  headerContainer: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    paddingBottom: 8,
  },
  logo: {
    width: 45,
    height: 45,
  },
  headerText: {
    flex: 1,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 2,
  },
  abn: {
    fontSize: 8,
  },
  partiesSection: {
    marginBottom: 8,
    paddingHorizontal: 50,
    flexDirection: "row",
    rowGap: 10,
    gap: 15,
    paddingVertical: 10,
  },
  partyColumn: {
    flex: 1,
  },
  partyTitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 4,
  },
  partyText: {
    fontSize: 10,
    marginBottom: 2,
    lineHeight: 1.2,
  },
  brokerRefSection: {
    width: "100%",
    paddingVertical: 6,
    marginBottom: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
  },
  brokerRefContent: {
    flexDirection: "row",
    paddingHorizontal: 50,
  },
  brokerRefItem: {
    width: "25%",
    fontSize: 9,
  },
  boldText: {
    fontWeight: "bold",
  },
  detailsSection: {
    marginTop: 10,
    paddingLeft: 50,
    paddingRight : 10,
    flexGrow: 1,
  },
  detailRow: {
    marginTop : 10,
    flexDirection: "row",
    marginBottom: 6,
    minHeight: 12,
  },
  detailLabel: {
    width: "25%",
    fontWeight: "bold",
    fontSize: 9,
  },
  detailValue: {
    width: "75%",
    fontSize: 9,
  },
  termsTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    fontSize: 9,
  },
  termsText: {
    fontSize: 9,
    lineHeight: 1.3,
    marginBottom: 8,
  },
  footerNote: {
    marginTop: "auto", // Push to bottom
    fontSize: 9,
    fontStyle: "italic",
    paddingHorizontal: 10,
    lineHeight: 1.2,
    paddingBottom: 10,
  },
});

const ExportContractPdf = ({ contracts }: { contracts: Contract[] }) => (
  <Document>
    {contracts.map((contract, index) => (
      <Page key={index} size="A4" style={contractPdfStyles.page}>
        <View style={contractPdfStyles.container}>
          <View style={contractPdfStyles.content}>
            {/* Header */}
            <View style={contractPdfStyles.headerContainer}>
              <View style={contractPdfStyles.header}>
                <PdfImage src="/Original.png" style={contractPdfStyles.logo} />
                <View style={contractPdfStyles.headerText}>
                  <Text style={contractPdfStyles.companyName}>
                    GROWTH GRAIN SERVICES
                  </Text>
                  <Text style={contractPdfStyles.abn}>ABN 64 157 832 216</Text>
                </View>
              </View>
            </View>

            {/* Buyer/Seller Section */}
            <View style={contractPdfStyles.partiesSection}>
              <View style={contractPdfStyles.partyColumn}>
                <Text style={contractPdfStyles.partyTitle}>Buyer</Text>
                <Text style={contractPdfStyles.partyText}>
                  {contract.buyer.name}
                </Text>
                <Text style={contractPdfStyles.partyText}>Top Box Stock</Text>
                <Text style={contractPdfStyles.partyText}>
                  Minimum VIC, 3004
                </Text>
                <Text style={contractPdfStyles.partyText}>
                  {contract.buyer.officeAddress}
                </Text>
                <Text style={contractPdfStyles.partyText}>
                  {contract.buyer.email}
                </Text>
              </View>

              <View style={contractPdfStyles.partyColumn}>
                <Text style={contractPdfStyles.partyTitle}>Seller</Text>
                <Text style={contractPdfStyles.partyText}>
                  {contract.seller.sellerLegalName}
                </Text>
                <Text style={contractPdfStyles.partyText}>
                  {contract.seller.sellerOfficeAddress}
                </Text>
                <Text style={contractPdfStyles.partyText}>
                  {contract.seller.sellerContactName}
                </Text>
                <Text style={contractPdfStyles.partyText}>
                  {contract.seller.sellerEmail}
                </Text>
              </View>
            </View>

            {/* Broker Ref Section */}
            <View style={contractPdfStyles.brokerRefSection}>
              <View>
                <View style={contractPdfStyles.brokerRefContent}>
                  <Text
                    style={[
                      contractPdfStyles.brokerRefItem,
                      contractPdfStyles.boldText,
                    ]}
                  >
                    Broker Ref:
                  </Text>
                  <Text style={contractPdfStyles.brokerRefItem}>
                    {contract.brokerReference}
                  </Text>
                  <Text
                    style={[
                      contractPdfStyles.brokerRefItem,
                      contractPdfStyles.boldText,
                    ]}
                  >
                    Contract Date:
                  </Text>
                  <Text style={contractPdfStyles.brokerRefItem}>
                    {contract.contractDate}
                  </Text>
                </View>
              </View>
            </View>

            {/* Contract Details - Main content area */}
            <View style={contractPdfStyles.detailsSection}>
              <View style={contractPdfStyles.detailRow}>
                <Text style={contractPdfStyles.detailLabel}>Commodity:</Text>
                <Text style={contractPdfStyles.detailValue}>
                  {contract.commodity}
                </Text>
              </View>

              <View style={contractPdfStyles.detailRow}>
                <Text style={contractPdfStyles.detailLabel}>Season:</Text>
                <Text style={contractPdfStyles.detailValue}>
                  {contract.commoditySeason}
                </Text>
              </View>

              <View style={contractPdfStyles.detailRow}>
                <Text style={contractPdfStyles.detailLabel}>Quality:</Text>
                <Text style={contractPdfStyles.detailValue}>
                  H1 AS PER GTA CSG-101 STANDARDS
                </Text>
              </View>

              <View style={contractPdfStyles.detailRow}>
                <Text style={contractPdfStyles.detailLabel}>Quantity:</Text>
                <Text style={contractPdfStyles.detailValue}>
                  20.66 METRIC TONNES - NIL TOLERANCE
                </Text>
              </View>

              <View style={contractPdfStyles.detailRow}>
                <Text style={contractPdfStyles.detailLabel}>Price:</Text>
                <Text style={contractPdfStyles.detailValue}>
                  A${contract.priceExGst} PER TONNE IN DISPOT YITTERM,
                  ROCKVORTHY
                </Text>
              </View>

              <View style={contractPdfStyles.detailRow}>
                <Text style={contractPdfStyles.detailLabel}>
                  Delivery Period:
                </Text>
                <Text style={contractPdfStyles.detailValue}>
                  {contract.deliveryOption}
                </Text>
              </View>

              <View style={contractPdfStyles.detailRow}>
                <Text style={contractPdfStyles.detailLabel}>Payment:</Text>
                <Text style={contractPdfStyles.detailValue}>
                  5 DARS END OF WEEK OF CULVERT SANDAR IS END OF WEED
                </Text>
              </View>

              <View style={contractPdfStyles.detailRow}>
                <Text style={contractPdfStyles.detailLabel}>Freight:</Text>
                <Text style={contractPdfStyles.detailValue}>
                  {contract.freight}
                </Text>
              </View>

              <View style={contractPdfStyles.detailRow}>
                <Text style={contractPdfStyles.detailLabel}>Weight:</Text>
                <Text style={contractPdfStyles.detailValue}>
                  {contract.weights}
                </Text>
              </View>

              <View style={contractPdfStyles.detailRow}>
                <Text style={contractPdfStyles.detailLabel}>
                  Terms & Conditions:
                </Text>
                <Text style={contractPdfStyles.detailValue}>
                  WHEN NOT IN CONFLICT WITH THE ABOVE CONDITIONS THIS CONTRACT
                  EXPRESSLY INCORPORATES THE TERMS & CONDITIONS OF THE GTA NO 3
                  CONTRACT INCLUDING THE GTA TRADE RULES AND DISPURE RESOLUTION
                  RULES
                </Text>
              </View>

              <View style={contractPdfStyles.detailRow}>
                <Text style={contractPdfStyles.detailLabel}>
                  Special Conditions:
                </Text>
                <Text style={contractPdfStyles.detailValue}>
                  {contract.specialCondition.toUpperCase()}
                </Text>
              </View>

              <View style={contractPdfStyles.detailRow}>
                <Text style={contractPdfStyles.detailLabel}>Brokerage:</Text>
                <Text style={contractPdfStyles.detailValue}>
                  AT SELLERS COST AT A$1.00 PER TONNE (EXCLUSIVE OF GST) INVOICE
                  TO SELLER TO BE FORWARDED ON SEPARATELY TO THIS CONTRACT
                </Text>
              </View>
            </View>

            {/* Footer Note - positioned at bottom */}
            <Text style={contractPdfStyles.footerNote}>
              Growth Grain Services as broker does not guarentee the performance
              of this contract. Both the buyer and the seller are bound by the
              above contract and mentioned GTA contracts to execute the
              contract. Seller is resposible for any applicable levies/royalties
            </Text>
          </View>
        </View>
      </Page>
    ))}
  </Document>
);

export default ExportContractPdf;
