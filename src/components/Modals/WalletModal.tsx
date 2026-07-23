import React, { useState } from "react";
import { useWalletMutations } from "@/hooks/useFinanceQueries"; // Adjust path as needed
import type { WalletDTO } from "@/types";
import toast from "react-hot-toast";

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
  editingWallet?: WalletDTO | null;
}

const WalletModalContent: React.FC<Omit<Props, "isOpen">> = ({
  onClose,
  editingWallet,
}) => {
  const { createWallet, updateWallet } = useWalletMutations();

  // Based on your backend's WalletType enum
  const [name, setName] = useState(editingWallet?.name || "");
  const [balance, setBalance] = useState(
    editingWallet ? editingWallet.balance.toString() : "",
  );
  const [type, setType] = useState(editingWallet?.type || "BANK");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedBalance = parseFloat(balance);

    if (!name.trim()) {
      toast.error("Wallet name is required");
      return;
    }

    if (isNaN(parsedBalance)) {
      toast.error("Please enter a valid balance");
      return;
    }

    const payload = {
      name,
      balance: parsedBalance,
      type,
    };

    try {
      if (editingWallet) {
        await updateWallet.mutateAsync({
          id: editingWallet.id,
          payload,
        });
        toast.success("Wallet updated successfully");
      } else {
        await createWallet.mutateAsync(payload);
        toast.success("Wallet created successfully");
      }
      onClose();
    } catch {
      toast.error("Failed to save wallet");
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editingWallet ? "Edit Wallet" : "Add New Wallet"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Wallet Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Chase Checking, Cash"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="balance">Initial Balance (₹)</Label>
            <Input
              id="balance"
              type="number"
              step="0.01"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="0.00"
              required
              className="font-mono"
              disabled={!!editingWallet} // Usually, we don't edit balance directly after creation; it updates via transactions
            />
            {!!editingWallet && (
              <p className="text-xs text-slate-500">
                Balance must be adjusted via transactions.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Wallet Type</Label>
            <Select
              value={type}
              onValueChange={(val) => {
                // Check if val exists before setting state, and cast it to your type
                if (val) setType(val as typeof type);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BANK">Bank Account</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
                <SelectItem value="CREDIT_CARD">Credit Card</SelectItem>
                <SelectItem value="DIGITAL_WALLET">Digital Wallet</SelectItem>
                <SelectItem value="INVESTMENT">Investment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editingWallet ? "Save Changes" : "Create Wallet"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export const WalletModal: React.FC<Props> = ({
  isOpen,
  onClose,
  editingWallet,
}) => {
  if (!isOpen) return null;

  const modalKey = editingWallet ? `edit-${editingWallet.id}` : "new-wallet";

  return (
    <WalletModalContent
      key={modalKey}
      onClose={onClose}
      editingWallet={editingWallet}
    />
  );
};
