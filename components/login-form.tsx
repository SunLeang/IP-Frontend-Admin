"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAuth } from "@/app/context/AuthContext";

export default function LoginForm() {
  const { loginApi } = useAuth();

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

  const toggleLoginType = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setLoginType((prev) => (prev === "admin" ? "superAdmin" : "admin"));
      setIsTransitioning(false);
    }, 300);
  };

  const handleLogin = () => {
    loginApi(formValues);
    // console.log("login page");

    // router.push(`/${loginType}/dashboard`);
  };

  return (
    <div className="flex flex-col flex-1 p-7 items-center pt-12">
      <div className="flex flex-col items-center w-full gap-6 max-w-[380px]">
        <div className="flex justify-center items-center w-[72px] h-[72px] rounded-full bg-[rgba(30,41,59,0.05)] shadow-md">
          <Icon icon="icon-park-outline:people" width="2.2em" height="2.2em" />
        </div>

        <h1 className="text-[#0F172A] text-xl font-medium font-['Kantumruy_Pro'] mb-2">
          Logining in your account
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
                  />
                </div>

                <div
                  className="flex items-center px-4 cursor-pointer text-[#64748B] hover:text-[#4880FF] transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
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
            className="flex justify-center items-center w-full h-[50px] bg-[#4880FF] rounded-[10px] text-white text-base font-['Kantumruy_Pro'] mt-3 shadow-md hover:shadow-lg transition-shadow duration-200 hover:bg-[#3A70F0]"
          >
            Login
          </button>

          <div className="flex justify-center mt-2">
            <button
              onClick={toggleLoginType}
              className="text-[#4880FF] text-sm hover:underline font-['Kantumruy_Pro'] hover:text-[#3A70F0] transition-colors duration-200"
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
