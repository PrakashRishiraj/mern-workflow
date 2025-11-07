import React from "react";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex">
      {/* Left side - form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Right side - image */}
      <div className="hidden md:flex w-1/2 bg-gray-100 items-center justify-center">
        <img
          src="../src/assets/images/auth-img.jpg" // place your generated image here (e.g. in /public/images/)
          alt="Login Illustration"
          className="w-fit h-full object-cover"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
