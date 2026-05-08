"use client";
import axios from "axios";
import Link from "next/link";
import React from "react";
const backend_url = process.env.NEXT_PUBLIC_BACKEND_URL;
const Page = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const username = formData.get("username") as string;
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const res = await axios.post(`${backend_url}/signup`, {
        username,
        email,
        password,
      });
      const data = res.data;
      console.log(data);
      if (data.token) {
        document.cookie = `token=${data.token}; path=/`;
        window.location.href = "/";
      } else {
        alert("Signup failed");
      }
    } catch (err) {
      console.log(err);
      alert(
        `Signup failed, ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center ">
      <h1 className="text-4xl font-bold">SignUp</h1>
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <input
          name="username"
          type="text"
          placeholder="Enter Username"
          className="border p-2 rounded"
        />
        <input
          name="email"
          type="email"
          placeholder="Enter Email"
          className="border p-2 rounded"
        />
        <input
          name="password"
          type="password"
          placeholder="Enter Password"
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Signup
        </button>
      </form>
      <Link href="/auth/signin" className="text-blue-500 mt-4">
        Already have an account? Sign In
      </Link>
    </div>
  );
};

export default Page;
