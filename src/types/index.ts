export type WalletType =
  | "BANK"
  | "CASH"
  | "CREDIT_CARD"
  | "DIGITAL_WALLET"
  | "INVESTMENT";
export type CategoryType = "INCOME" | "EXPENSE";
export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface AuthResponse {
  token: string;
  userId: number;
  name: string;
  email: string;
}

export interface WalletDTO {
  id: number;
  name: string;
  type: WalletType;
  balance: number;
  isDefault: boolean;
}

export interface CategoryDTO {
  id: number;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isDefault: boolean;
}

export interface TransactionDTO {
  id: number;
  amount: number;
  description: string;
  transactionDate: string;
  type: TransactionType;
  walletId: number;
  walletName: string;
  destinationWalletId?: number;
  destinationWalletName?: string;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface TransactionPayload {
  amount: number;
  description: string;
  transactionDate: string;
  type: TransactionType;
  walletId: number;
  destinationWalletId?: number;
  categoryId?: number;
}

export interface ApiErrorResponse {
  timestamp?: string;
  status?: number;
  error?: string;
  message: string;
  path?: string;
}

export interface WalletPayload {
  name: string;
  balance: number;
  type: string;
}
