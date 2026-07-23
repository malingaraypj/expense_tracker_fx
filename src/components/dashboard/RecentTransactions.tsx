import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatINR } from "@/utils/formatters";
import { type TransactionResponseDTO } from "@/types";

interface RecentTransactionsProps {
  transactions: TransactionResponseDTO[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({
  transactions,
}) => {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
              >
                <div className="flex flex-col">
                  <span className="font-medium">
                    {tx.categoryName || "Uncategorized"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(tx.date).toLocaleDateString()} • {tx.walletName}
                  </span>
                </div>
                <div
                  className={`font-bold ${
                    tx.type === "EXPENSE" ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {tx.type === "EXPENSE" ? "-" : "+"}
                  {formatINR(tx.amount)}
                </div>
              </div>
            ))
          ) : (
            <div className="text-sm text-muted-foreground">
              No recent transactions.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
