"use client";

import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ví dụ: hiển thị dữ liệu
    console.log("Username:", username);
    console.log("Password:", password);
    alert(`Đăng nhập với username: ${username}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col justify-center items-center font-sans p-4">
      <section className="bg-white rounded-2xl shadow-lg flex flex-col w-full max-w-md p-8 gap-6">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/images/mail_icon.png"
            alt="Logo"
            width={60}
            height={60}
          />
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 text-center">Đăng nhập</h1>
        <p className="text-sm text-gray-600 text-center">Nhập thông tin tài khoản của bạn</p>

        {/* Form */}
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Username"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Password"
            required
          />
          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white font-semibold rounded-full px-6 py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500"
          >
            Đăng nhập
          </button>
        </form>
      </section>
    </div>
  );
}
