
import React, { useState } from "react";
import axios from "axios";
import { loginUser, type UserRole } from "@/services/auth.services";


export default function Login() {
  const [formData, setformData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData({ ...formData, [e.target.name]: e.target.value.trimStart() });
  };

  const role: UserRole = "admin";

  const postLogin = async () => {
    try {
      const data = await loginUser(role, formData)
      if (data?.message) {
        setSuccessMessage(data.message)
      }  
    } catch (error) {
      let message = "Something went wrong. Please try again later.";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      setError(message);
      console.log(error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = formData;
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    setError("");
    setSuccessMessage("")
    postLogin();
  };
  return (
    <div className=" max-h-screen flex items-center justify-center">
      <div className="mx-auto p-8 rounded-xl shadow-md w-full max-w-sm mt-10">
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border-2 border-gray-400 rounded-md"
            value={formData.email}
            onChange={handleChange}
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border-2 border-gray-400 rounded-md"
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit" className="w-full text-white py-3 ">
            Login
          </button>

          {successMessage && <p className="text-2xl text-green-600 text-center">{successMessage}</p>}
        </form>
      </div>
    </div>
  );
}
