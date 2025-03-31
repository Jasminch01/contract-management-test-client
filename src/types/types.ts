export interface Client {
  id: string;
  buyerName: string;
  abn: string;
  mainContract: string;
  email: string;
  phone: string;
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
}

export interface ContractAttachments {
  sellersContract: string;
  buyersContract: string;
}

export type ContractStatus = "pending" | "completed";

export interface Contract {
  contractPrice: string;
  destination: string;
  grower: string;
  season: string;
  id: string;
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
  priceExGst: string;
  broker: string;
  conveyance: string;
  brokerReference: string;
  sellerContractReference: string;
  attachments: ContractAttachments;
  status: ContractStatus;
  createdAt: string; // ISO datetime format
  updatedAt: string; // ISO datetime format
}

// For the array of contracts
export type Contracts = Contract[];
