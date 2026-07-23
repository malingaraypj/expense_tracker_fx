import React from "react";
import { Provider, useSelector } from "react-redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { store, type RootState } from "./store";
import { Layout } from "@/layout/Layout";
import { AuthPage } from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import { Toaster } from "react-hot-toast";
import { WalletPage } from "./pages/WalletPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// --- ROUTER SETUP ---
const MainRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<AuthPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route
            element={
              <Layout>
                <Outlet />
              </Layout>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/wallets" element={<WalletPage />} />
            <Route path="/categories" element={<div>Categories Page</div>} />
            <Route path="/analytics" element={<div>Analytics Page</div>} />
          </Route>
        </Route>

        {/* Catch-all route for 404s - redirects to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

// --- APP ROOT ---

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

// --- ROUTE GUARDS ---

// Protects routes that require authentication
const ProtectedRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Outlet renders the nested child routes
  return <Outlet />;
};

// Prevents authenticated users from seeing the login page
const PublicRoute = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
