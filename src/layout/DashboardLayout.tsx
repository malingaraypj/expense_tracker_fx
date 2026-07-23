import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/authSlice";
import { type RootState } from "@/store";
import {
  LayoutDashboard,
  Wallet,
  Tag,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

interface Props {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex fixed left-0 right-0 top-0 bottom-0">
      {/* Sidebar Navigation */}
      <Sidebar />
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

function Sidebar() {
  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, active: true },
    { label: "Wallets", icon: Wallet, active: false },
    { label: "Categories", icon: Tag, active: false },
    { label: "Analytics", icon: BarChart3, active: false },
    { label: "Settings", icon: Settings, active: false },
  ];
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between md:flex">
      <div className="p-6">
        <div className="flex items-center gap-2 font-bold text-xl text-slate-900 tracking-tight mb-8">
          <div className="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-sm font-mono">
            F
          </div>
          FinanceOS
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={`#${item.label.toLowerCase()}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active
                  ? "bg-slate-100 text-slate-900 font-semibold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  );
}

function Header() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-30">
      <h1 className="text-lg font-semibold text-slate-800">
        Financial Overview
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600">
          Hello,{" "}
          <strong className="text-slate-900">{user?.name || "User"}</strong>
        </span>
        <button
          onClick={() => dispatch(logout())}
          className="p-2 text-slate-400 hover:text-rose-600 transition-colors rounded-lg border border-slate-200 hover:border-rose-100 hover:bg-rose-50"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
