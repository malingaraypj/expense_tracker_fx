import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/utils/formatters";
import { type WalletResponseDTO } from "@/types";

interface WalletSummaryProps {
  wallets: WalletResponseDTO[];
}

const WalletSummary: React.FC<WalletSummaryProps> = ({ wallets }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Wallets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {wallets.length > 0 ? (
            wallets.map((wallet) => (
              <div
                key={wallet.id}
                className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{wallet.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {wallet.type}
                  </span>
                </div>
                <span className="font-bold">{formatINR(wallet.balance)}</span>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No wallets created yet.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default WalletSummary;
