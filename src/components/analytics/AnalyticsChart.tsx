import React from "react";
import { useTransactions, useCategories } from "../../hooks/useFinanceQueries";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { formatINR } from "../../utils/formatters";

export const AnalyticsCharts: React.FC = () => {
  // Fetch a larger page for chart aggregation
  const { data: txData } = useTransactions(0, 100);
  const { data: categories = [] } = useCategories();
  const transactions = txData?.content || [];

  // 1. Aggregate Cash Flow (Income vs Expense)
  const cashFlowData = [
    {
      name: "Total Cash Flow",
      Income: transactions
        .filter((t) => t.type === "INCOME")
        .reduce((acc, t) => acc + t.amount, 0),
      Expense: transactions
        .filter((t) => t.type === "EXPENSE")
        .reduce((acc, t) => acc + t.amount, 0),
    },
  ];

  // 2. Aggregate Expenses Grouped by Category Color
  const expensesByCategory = transactions
    .filter((t) => t.type === "EXPENSE" && t.categoryId)
    .reduce<Record<string, { name: string; value: number; color: string }>>(
      (acc, tx) => {
        const cat = categories.find((c) => c.id === tx.categoryId);
        const name = tx.categoryName || "Other";
        const color = cat?.color || "#94a3b8";

        if (!acc[name]) {
          acc[name] = { name, value: 0, color };
        }
        acc[name].value += tx.amount;
        return acc;
      },
      {},
    );

  const pieData = Object.values(expensesByCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      {/* Cash Flow Bar Chart */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 text-sm mb-4">
          Cash Flow Overview
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={cashFlowData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis
                stroke="#94a3b8"
                fontSize={12}
                tickFormatter={(val) => `₹${val / 1000}k`}
              />
              {/* ✅ FIX 1: Let TS infer value and safely cast to Number */}
              <Tooltip
                formatter={(value) => [formatINR(Number(value || 0)), "Amount"]}
              />
              <Bar
                dataKey="Income"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
              <Bar
                dataKey="Expense"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Spending Breakdown Donut Chart */}
      <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
        <h3 className="font-semibold text-slate-800 text-sm mb-4">
          Expense Breakdown by Category
        </h3>
        <div className="h-64 w-full flex items-center justify-center">
          {pieData.length === 0 ? (
            <p className="text-sm text-slate-400">
              No expense data available to display chart.
            </p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                {/* ✅ FIX 2: Let TS infer value and safely cast to Number */}
                <Tooltip
                  formatter={(value) => [
                    formatINR(Number(value || 0)),
                    "Spent",
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};
