export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
  },
  wallets: {
    base: "/wallets",
    byId: (id: number) => `/wallets/${id}`,
  },
  categories: {
    base: "/categories",
    byId: (id: number) => `/categories/${id}`,
  },
  transactions: {
    base: "/transactions",
    byId: (id: number) => `/transactions/${id}`,
    // Cleanly encapsulates pagination parameters
    paginated: (page: number, size: number) =>
      `/transactions?page=${page}&size=${size}`,
  },
} as const;
