import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../services/api";
import {
  type WalletDTO,
  type CategoryDTO,
  type TransactionDTO,
  type PaginatedResponse,
  type TransactionPayload,
  type ApiErrorResponse,
  type WalletPayload,
} from "../types";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";

// Query Keys
export const QUERY_KEYS = {
  wallets: ["wallets"] as const,
  categories: ["categories"] as const,
  transactions: (page: number, size: number) =>
    ["transactions", page, size] as const,
};

// Fetchers
export const useWallets = () =>
  useQuery<WalletDTO[]>({
    queryKey: QUERY_KEYS.wallets,
    queryFn: async () => (await api.get("/wallets")).data,
  });

export const useCategories = () =>
  useQuery<CategoryDTO[]>({
    queryKey: QUERY_KEYS.categories,
    queryFn: async () => (await api.get("/categories")).data,
  });

export const useTransactions = (page = 0, size = 10) =>
  useQuery<PaginatedResponse<TransactionDTO>>({
    queryKey: QUERY_KEYS.transactions(page, size),
    queryFn: async () =>
      (await api.get(`/transactions?page=${page}&size=${size}`)).data,
    placeholderData: (previousData) => previousData,
  });

// Reactive Mutations
export const useTransactionMutations = () => {
  const queryClient = useQueryClient();

  const invalidateFinanceData = () => {
    queryClient.invalidateQueries({ queryKey: QUERY_KEYS.wallets });
    queryClient.invalidateQueries({ queryKey: ["transactions"] });
  };

  const createTransaction = useMutation({
    mutationFn: async (payload: TransactionPayload) =>
      (await api.post("/transactions", payload)).data,
    onSuccess: () => {
      invalidateFinanceData();
      toast.success("Transaction added successfully");
    },
    onError: (err: AxiosError<ApiErrorResponse>) =>
      toast.error(err.response?.data?.message || "Failed to add transaction"),
  });

  const updateTransaction = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: TransactionPayload;
    }) => (await api.put(`/transactions/${id}`, payload)).data,
    onSuccess: () => {
      invalidateFinanceData();
      toast.success("Transaction updated successfully");
    },
    onError: (err: AxiosError<ApiErrorResponse>) =>
      toast.error(
        err.response?.data?.message || "Failed to update transaction",
      ),
  });

  const deleteTransaction = useMutation({
    mutationFn: async (id: number) =>
      (await api.delete(`/transactions/${id}`)).data,
    onSuccess: () => {
      invalidateFinanceData();
      toast.success("Transaction deleted");
    },
    onError: () => toast.error("Failed to delete transaction"),
  });

  return { createTransaction, updateTransaction, deleteTransaction };
};

export const useWalletMutations = () => {
  const queryClient = useQueryClient();

  const createWallet = useMutation({
    mutationFn: async (payload: WalletPayload) => {
      const { data } = await api.post("/wallets", payload);
      return data;
    },
    onSuccess: () => {
      // This tells TanStack Query to refetch the wallets list instantly
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  const updateWallet = useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<WalletPayload>;
    }) => {
      const { data } = await api.put(`/wallets/${id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
    },
  });

  const deleteWallet = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/wallets/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallets"] });
      // You might also want to invalidate transactions,
      // since deleting a wallet usually affects transaction history.
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  return {
    createWallet,
    updateWallet,
    deleteWallet,
  };
};
