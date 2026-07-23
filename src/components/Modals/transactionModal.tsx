import React, { useState } from "react";
import {
  useWallets,
  useCategories,
  useTransactionMutations,
} from "@/hooks/useFinanceQueries";
import {
  type TransactionType,
  type TransactionDTO,
  type TransactionPayload,
} from "@/types";
import toast from "react-hot-toast";
import { formatINR } from "@/utils/formatters";

// shadcn components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editingTransaction?: TransactionDTO | null;
}

// 1. INNER COMPONENT
const TransactionModalContent: React.FC<Omit<Props, "isOpen">> = ({
  onClose,
  editingTransaction,
}) => {
  const { data: wallets = [] } = useWallets();
  const { data: categories = [] } = useCategories();
  const { createTransaction, updateTransaction } = useTransactionMutations();

  const defaultWallet = wallets.find((w) => w.isDefault) || wallets[0];

  const [type, setType] = useState<TransactionType>(
    editingTransaction?.type || "EXPENSE",
  );
  const [amount, setAmount] = useState<string>(
    editingTransaction ? editingTransaction.amount.toString() : "",
  );
  const [description, setDescription] = useState<string>(
    editingTransaction?.description || "",
  );
  const [date, setDate] = useState<string>(
    editingTransaction?.transactionDate ||
      new Date().toISOString().split("T")[0],
  );
  const [walletId, setWalletId] = useState<number>(
    editingTransaction?.walletId || 0,
  );
  const [destWalletId, setDestWalletId] = useState<number>(
    editingTransaction?.destinationWalletId || 0,
  );
  const [categoryId, setCategoryId] = useState<number>(
    editingTransaction?.categoryId || 0,
  );

  const effectiveWalletId = walletId || defaultWallet?.id || 0;
  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid amount greater than 0");
      return;
    }
    if (!effectiveWalletId) {
      toast.error("Please select a wallet");
      return;
    }
    if (type === "TRANSFER" && effectiveWalletId === destWalletId) {
      toast.error("Source and destination wallets cannot be the same");
      return;
    }
    if (type !== "TRANSFER" && !categoryId) {
      toast.error("Please select a category");
      return;
    }

    const payload: TransactionPayload = {
      amount: parsedAmount,
      description,
      transactionDate: date,
      type,
      walletId: effectiveWalletId,
      ...(type === "TRANSFER"
        ? { destinationWalletId: destWalletId }
        : { categoryId }),
    };

    try {
      if (editingTransaction) {
        await updateTransaction.mutateAsync({
          id: editingTransaction.id,
          payload,
        });
      } else {
        await createTransaction.mutateAsync(payload);
      }
      onClose();
    } catch {
      // Handled by mutation error callbacks
    }
  };

  return (
    // Hardcoded open=true because the outer wrapper handles the unmounting
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingTransaction ? "Edit Transaction" : "Add Transaction"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Type Toggle using Tabs */}
          <Tabs
            value={type}
            onValueChange={(v) => {
              setType(v as TransactionType);
              setCategoryId(0);
            }}
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="EXPENSE">EXPENSE</TabsTrigger>
              <TabsTrigger value="INCOME">INCOME</TabsTrigger>
              <TabsTrigger value="TRANSFER">TRANSFER</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Wallet Selection */}
          <div
            className={
              type === "TRANSFER" ? "grid grid-cols-2 gap-4" : "space-y-2"
            }
          >
            <div className="space-y-2">
              <Label>
                {type === "TRANSFER" ? "From Wallet" : "Account / Wallet"}
              </Label>
              <Select
                value={String(effectiveWalletId)}
                onValueChange={(val) => setWalletId(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet..." />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((w) => (
                    <SelectItem key={w.id} value={String(w.id)}>
                      {w.name} ({formatINR(w.balance)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conditional: To Wallet for TRANSFERS */}
            {type === "TRANSFER" && (
              <div className="space-y-2">
                <Label>To Wallet</Label>
                <Select
                  value={String(destWalletId)}
                  onValueChange={(val) => setDestWalletId(Number(val))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination..." />
                  </SelectTrigger>
                  <SelectContent>
                    {wallets
                      .filter((w) => w.id !== effectiveWalletId)
                      .map((w) => (
                        <SelectItem key={w.id} value={String(w.id)}>
                          {w.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Conditional: Category for INCOME / EXPENSE */}
          {type !== "TRANSFER" && (
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={categoryId ? String(categoryId) : undefined}
                onValueChange={(val) => setCategoryId(Number(val))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {filteredCategories.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Grocery shopping, monthly salary..."
            />
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingTransaction ? "Save Changes" : "Add Transaction"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// 2. OUTER WRAPPER
export const TransactionModal: React.FC<Props> = ({
  isOpen,
  onClose,
  editingTransaction,
}) => {
  if (!isOpen) return null;

  const modalKey = editingTransaction
    ? `edit-${editingTransaction.id}`
    : "new-tx";

  return (
    <TransactionModalContent
      key={modalKey}
      onClose={onClose}
      editingTransaction={editingTransaction}
    />
  );
};
