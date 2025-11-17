"use client";

import Image from "next/image";
import { useState } from "react";
import { getValidAccessToken } from "@/untils/getToken";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async  (e) => {
    e.preventDefault();
    try {
    const response = await fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });

      if (!response.ok) {
        Swal.fire({
          icon: 'error',           // biểu tượng lỗi
          title: 'Đăng nhập thất bại',
          text: 'Sai tên đăng nhập và mật khẩu',
          confirmButtonText: 'OK'
        });
      }
      else{
        const data = await response.json();
        console.log("Phản hồi từ server:", data);
        Cookies.set("access_token", data.access_token, { expires: (data.expires_in-50) / 86400, path: "/" });
        Cookies.set("refresh_token", data.refresh_token, { expires: (data.refresh_expires_in-500) / 86400, path: "/" });
        router.push("/");
      }
    } catch (error) {
      console.log("Lỗi đăng nhập:", error);
      alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  };

  const handleClickcheck = async  (e) => {
    e.preventDefault();
    let token = await getValidAccessToken()
    if (!token) {
      console.log("chua dang nhap")
      return
    } // logouy
    else{
    try {
    const response = await fetch("http://localhost:8080/checkLogin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });
      if (!response.ok) {
        Swal.fire({
          icon: 'error',           // biểu tượng lỗi
          title: 'Đăng nhập thất bại',
          text: 'Sai tên đăng nhập và mật khẩu',
          confirmButtonText: 'OK'
        });
      }
      else{
        const data = await response.json();
        // console.log("Phản hồi từ server:", data);

        // alert(`Đăng nhập thành công: ${username}`);
      }
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Tên đăng nhập hoặc mật khẩu không đúng!");
    }
  }
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
        {/* <button onClick={(e)=>handleClickcheck(e)}> check</button> */}
      </section>
    </div>
  );
}
