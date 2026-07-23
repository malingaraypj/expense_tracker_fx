import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from "recharts";
import { formatINR } from "@/utils/formatters";
import { type CategorySummaryDTO } from "@/types";

interface IncomeChartProps {
  data: CategorySummaryDTO[];
}

const IncomeChart: React.FC<IncomeChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income by Source</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="categoryName" />
              <YAxis />
              <RechartsTooltip
                cursor={{ fill: "transparent" }}
                formatter={(value) => formatINR(Number(value))}
              />
              <Bar dataKey="totalAmount" fill="#00C49F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No income this month
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IncomeChart;
