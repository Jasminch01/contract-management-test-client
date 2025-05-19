export interface HistoricalPrice {
  id: string;
  commodity: string;
  date: string;
  price: number;
  quality: string;
  comment?: string; // Optional field
}

export interface HistoricalPricesData {
  historical_prices: HistoricalPrice[];
}
export interface Note {
  id: string;
  noteName: string;
  notes: string;
  br: string;
  date: string;
  time: string;
}

export interface Buyer {
  id: string;
  name: string;
  abn: string;
  officeAddress: string;
  contactName: string;
  email: string;
  phone: string;
  isDeleted: boolean;
  createdAt: string; // ISO datetime format
  updatedAt: string; // ISO datetime format
}

export interface Seller {
  id: number;
  sellerLegalName: string;
  sellerOfficeAddress: string;
  sellerABN: string;
  sellerMainNGR: string;
  sellerAdditionalNGRs: string[];
  sellerContactName: string;
  sellerEmail: string;
  sellerPhoneNumber: string;
  isDeleted: boolean;
  createdAt: string; // ISO datetime format
  updatedAt: string; // ISO datetime format
}

export interface ContractAttachments {
  sellersContract: string;
  buyersContract: string;
}

export type ContractStatus = "incompleted" | "completed" | "invoiced";

export interface Contract {
  contractPrice: string;
  destination: string;
  grower: string;
  season: string;
  id: number;
  contractNumber: string;
  tonnes: string;
  certificationScheme: string;
  termsAndConditions: string;
  contractDate: string; // ISO date format "YYYY-MM-DD"
  deliveryPeriod: string; // ISO date format "YYYY-MM-DD"
  commoditySeason: string;
  deliveryOption: string;
  paymentTerms: string;
  commodity: string;
  freight: string;
  brokerRate: string;
  specialCondition: string;
  grade: string;
  weights: string;
  buyerContractReference: string;
  notes: string;
  buyer: Buyer;
  seller: Seller;
  priceExGst: string;
  broker: string;
  conveyance: string;
  brokerReference: string;
  sellerContractReference: string;
  attachments: ContractAttachments;
  status: ContractStatus;
  isDeleted: boolean;
  createdAt: string; // ISO datetime format
  updatedAt: string; // ISO datetime format
}

// For the array of contracts
export type Contracts = Contract[];
