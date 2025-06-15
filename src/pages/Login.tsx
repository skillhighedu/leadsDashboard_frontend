import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminLogin } from "@/services/admin.services"; 
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value.trimStart());
    if (name === "password") setPassword(value);
  };

  const login = async () => {

     const res = await adminLogin(email, password); // Rename your login function
     console.log(res)
     if(res)
     {
      navigate('/')
     }
  
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
 
    login();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border-0 p-8">
        <h1 className="text-xl font-bold text-center text-gray-800 mb-6">Login</h1>

    

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
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
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handleChange}
              className="py-3 px-4 text-base"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full font-semibold text-base transition-all"
          >
            Sign In
          </Button>
        </form>

     
      </div>
    </div>
  );
}
