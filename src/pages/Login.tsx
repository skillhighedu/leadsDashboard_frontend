import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminLogin } from "@/services/admin.services";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value.trimStart());
    if (name === "password") setPassword(value);
  };

  const validateForm = () => {
    if (!email) {
      toast.error("Email is required");
      return false;
    }
    if (!password) {
      toast.error("Password is required");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const res = await adminLogin(email, password);

      setIsLoading(false);
      if (res && res.token) {
        const { checkAuth, isCheckingAuth } = useAuthStore.getState();
        if (!isCheckingAuth) {
          await checkAuth();
        }
        navigate("/");
      }
    } catch (error) {
      handleApiError(error);
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
    <div
      className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2"
      style={{
        // Full-screen blended background: green (left) -> black (right)
        background:
          "linear-gradient(to right, #22c55e 0%, #10b981 35%, #064e3b 65%, #000000 100%)",
      }}
    >
      {/* subtle grid-lines across the whole background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(transparent_0%,black_60%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.06) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* soft radial highlight on the left to lift the brand */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-3xl" />

      {/* Left: brand content (text only; bg now comes from the parent) */}
      <div className="relative hidden lg:flex items-center justify-center px-10">
        <div className="relative z-10 text-left text-white max-w-xl">
          <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-sm">
            Skillhigh&apos;s <span className="text-white/90">CRM</span>
          </h1>
          <p className="mt-4 text-white/80 leading-relaxed">
            Streamline leads. Empower teams. Close faster.
          </p>
        </div>
      </div>

      {/* Right: login card */}
      <div className="relative flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Mobile brand header */}
          <div className="lg:hidden mb-6">
            <h2 className="text-2xl font-extrabold text-gray-900">
              Skillhigh&apos;s <span className="text-emerald-600">CRM</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back! Please sign in to continue.
            </p>
          </div>

          <h3 className="text-xl font-bold text-center text-gray-800 mb-6">
            Login
          </h3>

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
                autoComplete="username"
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
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 top-7 flex items-center text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                tabIndex={0}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
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

          <p className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
