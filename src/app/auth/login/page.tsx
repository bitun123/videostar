"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

function LoginPage() {
  const { login, loading } = useAuth();
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(formRef.current as HTMLFormElement);

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      await login(data.email, data.password);
      router.push("/");
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-800">
      <div className="w-[25rem] h-[30rem] bg-gray-700 p-8 rounded-lg flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold text-white">Login Page</h1>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-6 "
        >
          <div>
            <input
              type="email"
              name="email"
              placeholder="Enter Your Email.."
              className="bg-gray-600 w-full rounded text-white placeholder:text-gray-400 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-3 border-none outline-none"
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Enter Your Password.."
              className="bg-gray-600 w-full rounded text-white placeholder:text-gray-400 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-3 border-none outline-none"
            />
          </div>
          <button className="bg-blue-500  hover:bg-blue-600 text-white font-bold py-2 px-4 rounded active:scale-95 cursor-pointer">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
