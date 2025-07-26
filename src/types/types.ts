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

export interface PortZoneBid {
  _id?: string; // MongoDB _id mapped to this
  label:
    | "Outer Harbor"
    | "Port Lincoln"
    | "Port Giles"
    | "Wallaroo"
    | "Lucky Bay"
    | "Thevenard"
    | "Wallaroo Tports";
  season: string;

  // Bid types - matching backend schema exactly
  APW1: number | null;
  H1: number | number | null;
  H2: number | null;
  AUH2: number | null;
  ASW1: number | null;
  AGP1: number | null;
  SFW1: number | null;
  BAR1: number | null;
  MA1: number | null;
  CM1: number | null;
  COMD: number | null;
  CANS: number | null;
  FIEV: number | null;
  "NIP/HAL": number | null;
  // Timestamps (handled by MongoDB)
  createdAt?: Date;
  updatedAt?: Date;
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
  _id?: string;
  name: string;
  abn: string;
  officeAddress: string;
  accountNumber : string;
  contactName: string;
  email: string;
  phoneNumber: string;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt?: string;
}

export interface Seller {
  _id?: string;
  legalName: string;
  abn: string;
  additionalNgrs: string[];
  accountNumber: string;
  email: string;
  authorityToAct: string;
  address: string;
  mainNgr: string;
  contactName: string;
  locationZone: string[];
  phoneNumber: string;
  authorityActFormPdf: string | File;
  isDeleted?: boolean;
  deletedAt?: string;
  createdAt?: string;

  bulkHandlerCredentials?: {
    handlerName: {
      type: StringConstructor;
      enum: [
        "Viterra",
        "Graincorp",
        "GrainFlow",
        "Tports",
        "CBH",
        "Louis Dreyfus"
      ];
      required: true;
    };
    identifier?: string; // Username / Email / PAN no
    password?: string;
  };
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
  _id: string;
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
  tolerance: string;
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
  deletedAt: string;
  createdAt: string; // ISO datetime format
  updatedAt: string; // ISO datetime format
}

// For the array of contracts
export type Contracts = Contract[];
