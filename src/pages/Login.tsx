import  { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminLogin } from "@/services/admin.services";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/AuthStore";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { handleApiError } from "@/utils/errorHandler";

export default function Login() {
  const navigate = useNavigate();
  const { checkAuth, isCheckingAuth } = useAuthStore.getState();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      const res = await adminLogin(email.trim(), password);

      if (!res?.token) {
        toast.error("Invalid credentials");
        return;
      }

      if (!isCheckingAuth) {
        await checkAuth();
      }

      toast.success("Welcome back 👋");
      navigate("/");
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-neutral-950">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-transparent to-black" />

      {/* Subtle noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Auth container */}
      <div className="relative z-10 w-full max-w-md px-4">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Skillhigh <span className="text-emerald-400">CRM</span>
          </h1>

        </div>

        {/* Card */}
        <div className="rounded-2xl border border-white/10 bg-white/95 backdrop-blur-xl shadow-2xl p-8">
          <h2 className="text-lg font-semibold text-gray-900 text-center">
            Sign in to your account
          </h2>
          <p className="text-sm text-gray-500 text-center mt-1">
            Enter your credentials to continue
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!isLoading) handleLogin();
            }}
            className="mt-6 space-y-5"
          >
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <Input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="username"
                className="h-11"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                className="h-11 pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* CTA */}
            <Button
              type="submit"
              disabled={isLoading}
              size="lg"
              className="w-full h-11 font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
