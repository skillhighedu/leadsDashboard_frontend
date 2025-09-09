import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminLogin } from "@/services/admin.services";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";
import { Eye, EyeOff,  } from "lucide-react";

import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
//   const { login } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value.trimStart());
    if (name === "password") setPassword(value);
  };

  const validateForm = () => {
    if (!email){
        toast.error("Email is required");
        return false;
    }
    
    if (!password) {
        toast.error("Password is required");
        return false
    }
    
    return true
  }
  const handleLogin = async () => {

    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const res = await adminLogin(email, password);

      setIsLoading(false);
      if (res && res.token) {
        // After successful login, check auth to get user role
        const { checkAuth, isCheckingAuth } = useAuthStore.getState();
        if (!isCheckingAuth) {
          await checkAuth();
        }
        navigate("/");
      }
    } catch (error) {
        handleApiError(error)
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border-0 p-8">
        <h1 className="text-xl font-bold text-center text-gray-800 mb-6">
          Loginss
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={handleChange}
              className="py-3 px-4 text-base"
              disabled={isLoading}
            />
          </div>

          <div className="relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={handleChange}
              className="py-3 px-4 pr-10 text-base"
              disabled={isLoading}
            />
            <div
              className="absolute inset-y-0 right-3 top-7 flex items-center cursor-pointer text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full font-semibold text-base transition-all"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
