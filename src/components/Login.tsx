// src/components/Login.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import Notification from "./Notification";

declare global {
  interface Window {
    phoneEmailReceiver: (userObj: any) => void;
  }
}

const Login: React.FC = () => {
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const navigate = useNavigate();

  const [notification, setNotification] = useState({
    isVisible: false,
    type: "success" as "success" | "error" | "warning" | "info",
    title: "",
    message: "",
  });

  const showNotification = (type: any, title: string, message: string) => {
    setNotification({ isVisible: true, type, title, message });
  };

  const hideNotification = () => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  };

  // 🔥 Detect if user just registered
  useEffect(() => {
    const flag = localStorage.getItem("justRegistered");
    if (flag) {
      showNotification("success", "🎉 Account Created!", "Verify your email to continue.");
      localStorage.removeItem("justRegistered");
    }
  }, []);

  // 🔥 Phone.Email Callback Handler
  useEffect(() => {
    window.phoneEmailReceiver = async function (userObj: any) {
      const url = userObj?.user_json_url;
      if (!url) return showNotification("error", "Verification Error", "No verification URL.");

      try {
        const resp = await fetch("http://localhost:5000/fetch-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const data = await resp.json();
        const email = data?.email;

        if (!email) throw new Error("Invalid server response");

        localStorage.setItem("currentUser", JSON.stringify({ email }));
        setVerifiedEmail(email);

        showNotification("success", "✔ Login Successful!", "Redirecting...");

        setTimeout(() => navigate("/dashboard"), 1200);

      } catch {
        showNotification("error", "Verification Failed", "Please try again.");
      }
    };
  }, [navigate]);

  // 🔥 Force Load OTP Widget Script
  useEffect(() => {
    const scriptId = "pe_verify_email_script";
    const oldScript = document.getElementById(scriptId);
    if (oldScript) oldScript.remove();

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://www.phone.email/verify_email_v1.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 flex flex-col items-center pt-20">

      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white">Verify Your Email with OTP</h1>
        <p className="text-gray-300 mt-1">Secure Sign-In Process</p>
      </div>

      <div className="w-full max-w-lg px-6">
        <div className="bg-white/10 border border-white/20 backdrop-blur-lg p-10 rounded-3xl shadow-lg">
          <p className="text-white font-semibold mb-4">Email Address</p>

          <div className="flex justify-center">
            <div className="pe_verify_email" data-client-id="15356389288657443784"></div>
          </div>

          <p className="text-center text-gray-300 text-sm mt-6">
            Trusted by 10,000+ marketers worldwide.
          </p>
        </div>

        <p className="text-gray-300 text-center mt-6">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 underline font-semibold">
            Create Account
          </Link>
        </p>

        {verifiedEmail && (
          <p className="text-center text-green-400 mt-4">
            Verified: <span className="text-white">{verifiedEmail}</span>
          </p>
        )}
      </div>

      <Notification {...notification} onClose={hideNotification} />
    </div>
  );
};

export default Login;
