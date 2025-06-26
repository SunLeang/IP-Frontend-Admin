"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/hooks/AuthContext";

export default function LoginForm() {
  const { loginApi, loading } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<"admin" | "superAdmin">("admin");
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    username: false,
    email: false,
    password: false,
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ✅ Clear form when switching login types
  const toggleLoginType = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLoginType((prev) => (prev === "admin" ? "superAdmin" : "admin"));
      setFormValues({
        username: "",
        email: "",
        password: "",
      });
      setTouched({
        username: false,
        email: false,
        password: false,
      });
      setErrors({ email: "" });
      setIsTransitioning(false);
    }, 300);
  };

  // Validate email format
  useEffect(() => {
    if (touched.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!formValues.email) {
        setErrors((prev) => ({ ...prev, email: "" }));
      } else if (!emailRegex.test(formValues.email)) {
        setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }
  }, [formValues.email, touched.email]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const handleLogin = async () => {
    // Validate required fields
    if (!formValues.email || !formValues.password) {
      alert("Please fill in all required fields");
      return;
    }

    if (loginType === "superAdmin" && !formValues.username) {
      alert("Username is required for Super Admin login");
      return;
    }

    if (errors.email) {
      alert("Please fix email format");
      return;
    }

    setIsLoggingIn(true);

    try {
      console.log("🔄 Starting login for:", loginType);

      const result = await loginApi({
        ...formValues,
        systemRole: loginType === "admin" ? "ADMIN" : "SUPER_ADMIN",
      });

      if (!result.success) {
        alert(result.message || "Login failed.");
      }
    } catch (error) {
      console.error("❌ Login error:", error);
      alert("An unexpected error occurred during login.");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // ✅ Disable form during login
  const isFormDisabled = loading || isLoggingIn || isTransitioning;

  return (
    <div className="flex flex-col flex-1 p-7 items-center pt-12">
      <div className="flex flex-col items-center w-full gap-6 max-w-[380px]">
        <div className="flex justify-center items-center w-[72px] h-[72px] rounded-full bg-[rgba(30,41,59,0.05)] shadow-md">
          <Icon icon="icon-park-outline:people" width="2.2em" height="2.2em" />
        </div>

        <h1 className="text-[#0F172A] text-xl font-medium font-['Kantumruy_Pro'] mb-2">
          {isLoggingIn
            ? "Logging in..."
            : `Logging in as ${
                loginType === "admin" ? "Admin" : "Super Admin"
              }`}
        </h1>

        <div className="flex flex-col gap-4 w-full">
          <div
            className={`flex flex-col space-y-4 relative overflow-hidden transition-all duration-300 ease-in-out`}
          >
            {/* Form fields container with dynamic height */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isTransitioning ? "opacity-0" : "opacity-100"
              }`}
            >
              {/* Username field (only in superadmin mode) */}
              <div
                className={`transition-all duration-300 ease-in-out ${
                  loginType === "superAdmin"
                    ? "max-h-[54px] opacity-100 mb-4"
                    : "max-h-0 opacity-0 mb-0 overflow-hidden"
                }`}
              >
                <div className="flex flex-col rounded-[10px] border border-[#CBD5E1] shadow-sm hover:shadow transition-all duration-200 focus-within:border-[#4880FF]">
                  <div className="flex p-1 px-4 h-[50px] items-center">
                    <input
                      type="text"
                      name="username"
                      value={formValues.username}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      placeholder="Username"
                      className="w-full text-base text-[#0F172A] placeholder:text-[#64748B] font-['Kantumruy_Pro'] outline-none"
                      disabled={isFormDisabled}
                    />
                  </div>
                </div>
              </div>

              {/* Email field */}
              <div
                className={`flex flex-col rounded-[10px] border shadow-sm hover:shadow transition-all duration-200 ${
                  errors.email && touched.email
                    ? "border-red-500"
                    : touched.email && formValues.email && !errors.email
                    ? "border-green-500"
                    : "border-[#CBD5E1] focus-within:border-[#4880FF]"
                }`}
              >
                <div className="flex p-1 px-4 h-[50px] items-center">
                  <input
                    type="email"
                    name="email"
                    value={formValues.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Email"
                    className="w-full text-base text-[#0F172A] placeholder:text-[#64748B] font-['Kantumruy_Pro'] outline-none"
                    disabled={isFormDisabled}
                  />
                  {touched.email && formValues.email && (
                    <div className="flex items-center ml-1">
                      {errors.email ? (
                        <Icon
                          icon="mdi:alert-circle"
                          className="text-red-500"
                          width="1.2em"
                          height="1.2em"
                        />
                      ) : (
                        <Icon
                          icon="mdi:check-circle"
                          className="text-green-500"
                          width="1.2em"
                          height="1.2em"
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>
              {errors.email && touched.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}

              {/* Password field */}
              <div className="flex rounded-[10px] border border-[#CBD5E1] mt-4 shadow-sm hover:shadow transition-all duration-200 focus-within:border-[#4880FF]">
                <div className="flex p-1 px-4 h-[50px] items-center flex-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formValues.password}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Password"
                    className="w-full text-base text-[#0F172A] placeholder:text-[#64748B] font-['Kantumruy_Pro'] outline-none [appearance:textfield] [&::-ms-reveal]:hidden [&::-webkit-contacts-auto-fill-button]:hidden [&::-webkit-credentials-auto-fill-button]:hidden"
                    disabled={isFormDisabled}
                  />
                </div>

                <div
                  className="flex items-center px-4 cursor-pointer text-[#64748B] hover:text-[#4880FF] transition-colors duration-200"
                  onClick={() =>
                    !isFormDisabled && setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? (
                    <Icon icon="octicon:eye-24" width="1.4em" height="1.4em" />
                  ) : (
                    <Icon
                      icon="mdi:eye-off-outline"
                      width="1.4em"
                      height="1.4em"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogin}
            disabled={isFormDisabled}
            className={`flex justify-center items-center w-full h-[50px] rounded-[10px] text-white text-base font-['Kantumruy_Pro'] mt-3 shadow-md transition-all duration-200 ${
              isFormDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#4880FF] hover:bg-[#3A70F0] hover:shadow-lg"
            }`}
          >
            {isLoggingIn ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </button>

          <div className="flex justify-center mt-2">
            <button
              onClick={toggleLoginType}
              disabled={isFormDisabled}
              className={`text-sm font-['Kantumruy_Pro'] transition-colors duration-200 ${
                isFormDisabled
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#4880FF] hover:underline hover:text-[#3A70F0]"
              }`}
            >
              {loginType === "admin"
                ? "Login as Super Admin"
                : "Login as Admin"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
