// src/components/Dashboard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import {
  Clock,
  MapPin,
  TrendingUp,
  Star,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  BarChart3,
  Palette
} from "lucide-react";
import { format } from "date-fns";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState("Loading...");
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [localTrends, setLocalTrends] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Get current user from localStorage
  const currentUserObj = JSON.parse(localStorage.getItem("currentUser") || "null");
  const currentUserName = (currentUserObj && (currentUserObj.fullName || currentUserObj.email)) || "User";

  // show scroller when profile seems incomplete
  const isProfileUpdated = !!(currentUserObj && currentUserObj.fullName);
  const showScrollingText = !isProfileUpdated;

  // Reverse Geocoding using OpenCage API
  const reverseGeocode = async (lat: number, lng: number) => {
    const apiKey = import.meta.env.VITE_OPENCAGE_API_KEY;

    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`
      );
      const data = await response.json();
      return data.results?.[0]?.formatted || "Unknown Location";
    } catch (error) {
      return "Address lookup failed";
    }
  };

  useEffect(() => {
    // redirect if not logged in
    if (!currentUserObj) {
      navigate("/login");
      return;
    }

    // update time every 2s
    const timer = setInterval(() => setCurrentTime(new Date()), 2000);

    // attempt to get geolocation (graceful)
    const getLocation = () =>
      new Promise<{ lat?: number; lng?: number }>((resolve) => {
        if (!navigator.geolocation) {
          resolve({});
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          },
          () => resolve({}),
          { timeout: 5000 }
        );
      });

    const fetchData = async () => {
      try {
        const pos = await getLocation();

        if (pos.lat && pos.lng) {
          const address = await reverseGeocode(pos.lat, pos.lng);
          setLocation(address);
        } else {
          setLocation("Location denied");
        }

        // Example: fallback static data for recommendations & trends so dashboard is never empty
        const sampleProducts = [
          { name: "Smart Dog Collar", category: "Pet Accessories" },
          { name: "Organic Pet Shampoo", category: "Pet Care" },
          { name: "Interactive Feeder", category: "Pet Supplies" },
          { name: "Premium Dog Food", category: "Food" },
          { name: "Cat Scratching Post", category: "Furniture" },
          { name: "Bird Cage Deluxe", category: "Bird Supplies" }
        ];
        const sampleTrends = [
          "Short-form video ads for local brands",
          "Conversational AI for commerce",
          "Sustainability-driven product lines",
          "Hyperlocal targeting in tier-2 cities",
          "Email-first re-engagement campaigns",
          "Micro-influencer collaborations"
        ];

        // Pretend to call an AI / external service — but use fallback sample data
        setRecommendedProducts(sampleProducts);
        setLocalTrends(sampleTrends);
          // Fetch real data from backend
          try {
            const productsRes = await fetch("http://localhost:5000/api/top-products");
            const productsData = await productsRes.json();
            if (productsData.success) {
              setRecommendedProducts(productsData.data);
            }
          } catch (err) {
            console.error("Failed to fetch top products:", err);
          }

          try {
            const trendsRes = await fetch("http://localhost:5000/api/marketing-trends");
            const trendsData = await trendsRes.json();
            if (trendsData.success) {
              setLocalTrends(trendsData.data);
            }
          } catch (err) {
            console.error("Failed to fetch trends:", err);
          }
        } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const quickActions = [
    {
      icon: TrendingUp,
      title: "Create Campaign",
      desc: "AI-powered marketing campaigns",
      color: "blue",
      path: "/campaigns",
      onClick: () => navigate("/campaigns"),
    },
    {
      icon: BarChart3,
      title: "View Analytics",
      desc: "Performance insights & metrics",
      color: "green",
      path: "/analytics",
      onClick: () => navigate("/analytics"),
    },
    {
      icon: Users,
      title: "Customer Journey",
      desc: "Track user interactions",
      color: "purple",
      path: "/customer-journey",
      onClick: () => navigate("/customer-journey"),
    },
    {
      icon: Palette,
      title: "AI Marketing Assistant",
      desc: "Get instant AI help",
      color: "pink",
      path: "/ai-chat",
      onClick: () => navigate("/ai-chat"),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="lg:pl-72 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Top bar / greeting */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                {showScrollingText ? (
                  <div className="text-xl font-semibold text-gray-800">
                    🚀 Please update your user profile first.
                  </div>
                ) : (
                  <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUserName}!</h1>
                )}
                <p className="text-gray-600">Ready to transform your marketing with AI?</p>
              </div>
            </div>
          </div>

          {/* Info banner */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-lg overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm">Your Location</div>
                    <div className="font-semibold">{location}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm">Current Time</div>
                    <div className="font-semibold">{format(currentTime, "PPpp")}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-sm">Active Campaigns</div>
                    <div className="font-semibold">5 Running</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations and Trends */}
          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                  <Star className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Top Products in {location}</h2>
                  <p className="text-sm text-gray-500">Local market leaders & bestsellers</p>
                </div>
              </div>

              {loadingData ? (
                <p className="text-gray-500">Loading product recommendations...</p>
              ) : (
                <div className="space-y-3">
                  {recommendedProducts.map((p, i) => (
                    <div key={i} className="p-4 rounded-xl border hover:shadow transition flex items-center">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center mr-4">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{p.name}</div>
                        <div className="text-sm text-gray-500">{p.category}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow border">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center mr-4">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Marketing Trends in {location}</h2>
                  <p className="text-sm text-gray-500">Latest regional insights</p>
                </div>
              </div>

              {loadingData ? (
                <p className="text-gray-500">Loading trends...</p>
              ) : (
                <div className="space-y-3">
                  {localTrends.map((t, i) => (
                    <div key={i} className="p-4 rounded-xl border hover:shadow transition flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center mr-4">
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{t}</div>
                          <div className="text-sm text-gray-500">High-impact trend</div>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-yellow-500 mr-3" />
              <h3 className="text-2xl font-bold text-gray-900">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {quickActions.map((action, idx) => {
                const Icon = action.icon;
                return (
                  <div
                    key={idx}
                    onClick={action.onClick}
                    className="bg-white p-6 rounded-2xl shadow hover:shadow-2xl cursor-pointer border"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{action.title}</h4>
                    <p className="text-sm text-gray-500">{action.desc}</p>
                    <div className="mt-4 text-blue-600 font-medium inline-flex items-center">
                      Get Started <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
