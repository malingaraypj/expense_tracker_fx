import React from "react";
import { Provider, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { store, type RootState } from "./store";
import { DashboardLayout } from "@/layout/DashboardLayout";
import { WalletGrid } from "@/components/wallets/walletGrid";
import { AnalyticsCharts } from "@/components/analytics/AnalyticsChart";
import { TransactionTable } from "./components/transactions/transactionTable";
import { AuthPage } from "./pages/AuthPage";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const MainRouter: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <DashboardLayout>
      <WalletGrid />
      <AnalyticsCharts />
      <TransactionTable />
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MainRouter />
        <Toaster position="bottom-right" />
      </QueryClientProvider>
    </Provider>
  );
}
