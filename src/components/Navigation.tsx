// src/components/Navigation.tsx
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Megaphone,
  MessageSquare,
  Users,
  BarChart3,
  ShoppingBag,
  LogOut,
  Sparkles,
  User,
  TrendingUp,
  Menu,
  X,
  ChevronRight,
  Layers // ⭐ NEW ICON FOR PRODUCT RANGE
} from "lucide-react";

const Navigation: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalUsers: 0,
    conversionRate: 0,
    revenueGrowth: 0,
  });

  // ⭐ UPDATED navItems — Added Product Range
  const navItems = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "blue", description: "Overview & Analytics" },
    { path: "/campaigns", icon: Megaphone, label: "Campaigns", color: "purple", description: "AI Campaign Generator" },
    { path: "/ai-chat", icon: MessageSquare, label: "AI Chat", color: "green", description: "Marketing Assistant" },
    { path: "/customer-journey", icon: Users, label: "Customer Journey", color: "orange", description: "User Analytics" },
    { path: "/analytics", icon: BarChart3, label: "Analytics", color: "pink", description: "Performance Insights" },
    { path: "/product-recommendation", icon: ShoppingBag, label: "Products", color: "teal", description: "Recommendations" },

    // ⭐ NEWLY ADDED NAV ITEM
    { path: "/product-range", icon: Layers, label: "Product Range", color: "violet", description: "Filter by Price Range" },

    { path: "/user-profile", icon: User, label: "User Profile", color: "cyan", description: "Account Settings" },
    { path: "/trend-analyzer", icon: TrendingUp, label: "Trend Analyzer", color: "emerald", description: "Market Trends" },
  ];

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const campaigns = new Set(users.map((u: any) => u.campaign).filter(Boolean)).size;
    const customers = users.filter((u: any) => u.userType === "Customer" || u.userType === "Loyal Customer").length;
    const conversion = users.length ? Math.round((customers / users.length) * 100) : 0;
    const totalRevenue = users.reduce((s: number, u: any) => s + (getBudgetValue(u.estimatedBudget || "₹10k-₹50k")), 0);
    const revenueGrowth = Math.round((totalRevenue / 1000000) * 100) / 10;
    setStats({
      activeCampaigns: campaigns,
      totalUsers: users.length,
      conversionRate: conversion,
      revenueGrowth,
    });
  }, []);

  const getBudgetValue = (budget: string) => {
    switch (budget) {
      case "< ₹10k": return 5000;
      case "₹10k-₹50k": return 30000;
      case "₹50k-₹1L": return 75000;
      case "₹1L-₹5L": return 300000;
      case "₹5L+": return 750000;
      default: return 30000;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  return (
    <>
      {/* top mobile bar */}
      <nav className="lg:hidden bg-white/95 backdrop-blur-lg shadow sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-800">Marketing AI</h1>
            </div>

            <div className="flex items-center">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
                <Menu className="w-6 h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* mobile overlay */}
      {isMobileMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setIsMobileMenuOpen(false)} />}

      {/* mobile panel */}
      <div className={`lg:hidden fixed top-0 left-0 h-full w-80 bg-white z-50 transform transition-transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Marketing AI</h2>
                <p className="text-white text-xs">Navigation</p>
              </div>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg bg-white/10">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto h-full">
          <div className="space-y-3 mb-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition ${isActive ? "bg-gradient-to-r from-blue-50 to-purple-50 scale-102" : "hover:bg-gray-50"}`}
                >
                  <div className="flex items-center">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${isActive ? "bg-white shadow" : "bg-gray-100"}`}>
                      <Icon className="w-5 h-5 text-gray-700" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{item.label}</div>
                      <div className="text-xs text-gray-500">{item.description}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              );
            })}
          </div>

          <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <LogOut className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <div className="font-semibold">Logout</div>
                <div className="text-xs text-gray-500">Sign out safely</div>
              </div>
            </div>
          </button>

          <div className="mt-6 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl">
            <h4 className="font-bold text-gray-800 mb-3">Live Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Active Campaigns</span>
                <span className="font-semibold text-gray-800">{stats.activeCampaigns}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Users</span>
                <span className="font-semibold text-gray-800">{stats.totalUsers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-72 lg:flex lg:flex-col lg:pt-6 lg:bg-white lg:border-r lg:border-gray-100 z-30`}>
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Marketing AI</h3>
                <div className="text-xs text-gray-500">Dashboards</div>
              </div>
            </div>

            <button
              onClick={() => setIsCollapsed(prev => !prev)}
              title={isCollapsed ? "Expand" : "Collapse"}
              className="p-2 rounded-md text-gray-600 hover:bg-gray-50"
            >
              {isCollapsed ? <Menu className="w-5 h-5" /> : <X className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <nav className="px-4 space-y-2 overflow-y-auto flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                to={item.path}
                key={item.path}
                className={`flex items-center px-4 py-3 rounded-lg transition ${isActive ? "bg-gray-100 shadow-sm" : "hover:bg-gray-50"}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${isActive ? "bg-white" : "bg-gray-100"}`}>
                  <Icon className="w-5 h-5 text-gray-700" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-xs text-gray-500">{item.description}</div>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="px-4 py-6 border-t">
          <button onClick={handleLogout} className="w-full text-left px-4 py-3 rounded-lg text-red-600 hover:bg-red-50">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <LogOut className="w-4 h-4 text-red-600" />
              </div>
              <div>
                <div className="font-semibold text-gray-900">Logout</div>
                <div className="text-xs text-gray-500">Sign out safely</div>
              </div>
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Navigation;
