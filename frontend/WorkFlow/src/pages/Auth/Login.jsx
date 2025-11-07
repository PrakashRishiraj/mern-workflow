// src/pages/Auth/Login.jsx
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, LogIn, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email && !password) {
      setLoading(false);
      return setError("Please enter both email and password.");
    }
    if (!email) {
      setLoading(false);
      return setError("Email is required.");
    }
    if (!password) {
      setLoading(false);
      return setError("Password is required.");
    }
    if (!validateEmail(email)) {
      setLoading(false);
      return setError("Please enter a valid email address.");
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        if (remember) localStorage.setItem("remember", "1");
        updateUser(response.data);

        // Route by role
        if (role === "admin") navigate("/admin/dashboard");
        else navigate("/user/dashboard");
      } else {
        setError("Login failed — no token returned.");
      }
    } catch (err) {
      setError(err?.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    if (error) setError(null);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 text-white px-4 py-8 lg:py-0">
      {/* Animated Background Orbs - Matching SignUp */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 lg:w-[600px] lg:h-[600px] -top-20 -left-20 lg:top-0 lg:left-0 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-3xl animate-float-slow" />
        <div className="absolute w-80 h-80 lg:w-[500px] lg:h-[500px] top-1/2 -right-20 lg:right-0 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl animate-float-medium" />
        <div className="absolute w-72 h-72 lg:w-[400px] lg:h-[400px] -bottom-20 left-1/4 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-float-fast" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Left Panel - Hero Section */}
        <div className="flex flex-col justify-center px-6 lg:px-10 py-8 lg:py-0 animate-fade-in">
          <div className="max-w-lg space-y-6">
            <div className="inline-block">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4 lg:mb-6 animate-linear">
                Welcome Back
              </h1>
            </div>
            
            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              Sign in to continue your journey. Secure, fast, and made for productive teams.
            </p>

            {/* Feature List */}
            <div className="space-y-3 pt-4">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-sm sm:text-base">Fast and secure authentication</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base">Role-based dashboards</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-sm sm:text-base">Team & project collaboration</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0 animate-slide-up">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10">
            
            {/* Header */}
            <div className="text-center mb-6 lg:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
                Sign In
              </h2>
              <p className="text-slate-400 text-sm sm:text-base">
                Enter your credentials to continue
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div 
                role="alert" 
                className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3 animate-shake"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Email Field */}
              <div className="group">
                <label 
                  htmlFor="email" 
                  className="block text-sm mb-1.5 text-slate-300 font-medium"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-indigo-400 w-5 h-5 transition-colors" />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearError();
                    }}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 text-slate-100 transition-all duration-200"
                    aria-label="Email"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label 
                  htmlFor="password" 
                  className="block text-sm mb-1.5 text-slate-300 font-medium"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-indigo-400 w-5 h-5 transition-colors" />
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      clearError();
                    }}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 text-slate-100 transition-all duration-200"
                    aria-label="Password"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-indigo-600 active:scale-98 mt-6"
                aria-live="polite"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </>
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center text-sm text-slate-400">
              <span>Don't have an account? </span>
              <Link 
                to="/signup" 
                className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors"
              >
                Sign up
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Custom Animations - Matching SignUp */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, -40px) scale(1.15); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.05); }
          50% { transform: translate(-30px, -10px) scale(0.95); }
          75% { transform: translate(10px, 20px) scale(1.1); }
        }
        @keyframes linear {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        
        .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 15s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 18s ease-in-out infinite; }
        .animate-linear { 
          background-size: 200% 200%;
          animation: linear 3s ease infinite;
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-up { animation: slide-up 0.6s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .active\\:scale-98:active { transform: scale(0.98); }
        
        /* Checkbox styles */
        .peer:checked ~ div {
          background: linear-linear(90deg, #2563eb, #4f46e5);
        }
        
        /* Screen reader only */
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border-width: 0;
        }
      `}</style>
    </div>
  );
}