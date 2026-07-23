import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/authSlice";
import api from "../services/api";
import toast from "react-hot-toast";

import axios from "axios";
import { ENDPOINTS } from "@/services/endpoints";

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? ENDPOINTS.auth.login : ENDPOINTS.auth.register;
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const { data } = await api.post(endpoint, payload);
      dispatch(setCredentials(data));
      toast.success(
        isLogin ? "Welcome back!" : "Account created successfully!",
      );
      window.location.href = "/dashboard";
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        toast.error(error.response?.data?.message || "Authentication failed");
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected authentication error occurred");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900">FinanceOS</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your personal finances with clarity
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`py-2 text-sm font-medium rounded-lg transition-all ${
              isLogin
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`py-2 text-sm font-medium rounded-lg transition-all ${
              !isLogin
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          )}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg shadow-sm transition-all text-sm mt-2"
          >
            {isLogin ? "Sign In to Dashboard" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};
