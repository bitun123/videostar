"use client";

import { useAuth } from "@/hooks/useAuth";
import React, { useRef } from "react";

function Registerpage() {
  const { register, loading } = useAuth();

  const fromRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData(fromRef.current as HTMLFormElement);

    const data = {
      name: formdata.get("name") as string,
      email: formdata.get("email") as string,
      password: formdata.get("password") as string,
    };
    try {
      await register(data.name, data.email, data.password);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gray-800">
      <div className="w-[25rem] h-[30rem] bg-gray-700 p-8 rounded-lg flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-bold text-white">Register</h1>
        <form
          ref={fromRef}
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-6 "
        >
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="bg-gray-600 text-white placeholder:text-gray-400 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-3 border-none outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="bg-gray-600 text-white placeholder:text-gray-400 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-3 border-none outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="bg-gray-600 text-white placeholder:text-gray-400 border border-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 py-3 border-none outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded active:scale-95 cursor-pointer"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registerpage;
