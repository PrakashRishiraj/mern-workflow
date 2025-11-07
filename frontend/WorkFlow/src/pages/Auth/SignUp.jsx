import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, User, UserPlus, Users, Camera, Loader2, AlertCircle } from "lucide-react";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../utils/uploadImage";

const SignUp = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImageUrl: "",
    adminInviteToken: "111111",
    userType: "admin",
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.id]: e.target.value });
    if (error) setError(null); // Clear error on input change
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      setProfileImage(file);
      setPreview(URL.createObjectURL(file));
      if (error) setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    let profileImageUrl = "";

    const { name, email, password, confirmPassword, userType } = form;
    
    if (!name || !email || !password || !confirmPassword || !userType) {
      setIsLoading(false);
      return setError("All fields are required.");
    }
    if (!validateEmail(email)) {
      setIsLoading(false);
      return setError("Please enter a valid email address.");
    }
    if (password.length < 8) {
      setIsLoading(false);
      return setError("Password must be at least 8 characters long.");
    }
    if (password !== confirmPassword) {
      setIsLoading(false);
      return setError("Passwords do not match.");
    }
    if (userType === "admin" && !form.adminInviteToken) {
      setIsLoading(false);
      return setError("Admin invite token is required.");
    }

    try {
      if (profileImage) {
        const imageUploadRes = await uploadImage(profileImage);
        profileImageUrl = imageUploadRes.imageUrl;
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        name,
        email,
        password,
        profileImageUrl,
        selectedRole: userType,
        adminInviteToken: form.adminInviteToken,
      });

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate(role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden relative px-4 py-8 lg:py-0">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 lg:w-[600px] lg:h-[600px] -top-20 -left-20 lg:top-0 lg:left-0 bg-indigo-500/20 rounded-full mix-blend-screen filter blur-3xl animate-float-slow" />
        <div className="absolute w-80 h-80 lg:w-[500px] lg:h-[500px] top-1/2 -right-20 lg:right-0 bg-blue-500/20 rounded-full mix-blend-screen filter blur-3xl animate-float-medium" />
        <div className="absolute w-72 h-72 lg:w-[400px] lg:h-[400px] -bottom-20 left-1/4 bg-purple-500/20 rounded-full mix-blend-screen filter blur-3xl animate-float-fast" />
      </div>

      {/* Left Panel - Hero Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center text-center px-6 lg:px-10 py-8 lg:py-0 relative z-10">
        <div className="max-w-lg space-y-6 animate-fade-in">
          <div className="inline-block">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold bg-linear-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4 lg:mb-6 animate-linear">
              Welcome to WorkFlow
            </h1>
          </div>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Create your account and start collaborating on amazing projects.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm sm:text-base">
            <span className="px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-300 backdrop-blur-sm">
              <span className="font-semibold">Member</span>
            </span>
            <span className="px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-300 backdrop-blur-sm">
              <span className="font-semibold">Leader</span>
            </span>
            <span className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full text-purple-300 backdrop-blur-sm">
              <span className="font-semibold">Admin</span>
            </span>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="relative z-10 w-full lg:w-1/2 max-w-md xl:max-w-lg animate-slide-up">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-2">
              Create Account
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Fill in your details to get started
            </p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-900/30 border border-red-500/50 text-red-200 px-4 py-3 rounded-xl mb-6 text-sm flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Profile Image Upload */}
          <div className="flex flex-col items-center mb-6 lg:mb-8">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-indigo-500/50 group-hover:border-indigo-400 flex items-center justify-center bg-slate-800/80 overflow-hidden transition-all duration-300 shadow-lg shadow-indigo-500/20">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 group-hover:text-slate-300 transition-colors" />
                )}
              </div>
              <label
                htmlFor="profileImage"
                className="absolute -bottom-1 -right-1 bg-linear-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 p-2 rounded-full cursor-pointer transition-all duration-300 shadow-lg hover:scale-110 active:scale-95"
              >
                <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </label>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Upload Profile Photo (Max 5MB)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-5">
            {/* Name */}
            <div className="group">
              <label htmlFor="name" className="block text-sm mb-1.5 text-slate-300 font-medium">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-indigo-400 w-5 h-5 transition-colors" />
                <input
                  id="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 text-slate-100 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label htmlFor="email" className="block text-sm mb-1.5 text-slate-300 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-indigo-400 w-5 h-5 transition-colors" />
                <input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 text-slate-100 transition-all duration-200"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="group">
                <label htmlFor="password" className="block text-sm mb-1.5 text-slate-300 font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-indigo-400 w-5 h-5 transition-colors" />
                  <input
                    id="password"
                    type="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 text-slate-100 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm mb-1.5 text-slate-300 font-medium">
                  Confirm
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-slate-500 group-focus-within:text-indigo-400 w-5 h-5 transition-colors" />
                  <input
                    id="confirmPassword"
                    type="password"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-500 text-slate-100 transition-all duration-200"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 flex items-center justify-center gap-2 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-indigo-600 active:scale-98 mt-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-slate-400 mt-6 text-sm">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-400 font-semibold hover:text-blue-300 hover:underline transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Custom Animations */}
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
        @keyframes slide-down {
          from { opacity: 0; max-height: 0; transform: translateY(-10px); }
          to { opacity: 1; max-height: 200px; transform: translateY(0); }
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
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .active\\:scale-98:active { transform: scale(0.98); }
      `}</style>
    </div>
  );
};

export default SignUp;