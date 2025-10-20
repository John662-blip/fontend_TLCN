"use client";
import { useState,useRef } from "react";
import { useRouter } from "next/navigation";


export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

    const handleUploadAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);
        setUser((prev) => ({ ...prev, avatar: imageUrl }));
    }
    };

  const [tab, setTab] = useState("info");
  const [user, setUser] = useState({
    mail: "user@gmail.com",
    name: "Nguyễn Văn A",
    avatar: "",
    role: "STAFF",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async () => {
    setMessage("✅ Cập nhật thông tin thành công!");
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp!");
      return;
    }
    setMessage("✅ Đổi mật khẩu thành công!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 relative">

        {/* 🔙 Nút quay về */}
        <button
          onClick={() => router.push("/")}
          className="absolute left-4 top-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg shadow transition-all duration-300 hover:-translate-y-1"
        >
          ⬅ Quay về
        </button>

        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">👤 Hồ Sơ Cá Nhân</h1>

        {/* Tabs */}
        <div className="flex justify-center mb-6 space-x-2">
          <button
            className={`px-6 py-2 rounded-t-xl font-medium transition-all duration-300 ${
              tab === "info"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setTab("info")}
          >
            Thông tin cá nhân
          </button>
          <button
            className={`px-6 py-2 rounded-t-xl font-medium transition-all duration-300 ${
              tab === "password"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
            onClick={() => setTab("password")}
          >
            Đổi mật khẩu
          </button>
        </div>

        {/* Thông báo */}
        {message && (
          <div className="mb-4 p-4 rounded-lg bg-blue-100 text-blue-900 font-semibold shadow">
            {message}
          </div>
        )}

        {/* Nội dung tab Thông tin */}
        {tab === "info" && (
          <div className="p-4">
            <div className="flex flex-col items-center mb-6">
              <img
                src={user.avatar || "/default-avatar.png"}
                alt="Avatar"
                className="w-32 h-32 rounded-full border-4 border-blue-300 shadow-lg object-cover"
              />
            <button
                onClick={() => fileInputRef.current.click()}
                className="mt-4 px-4 py-2 text-sm bg-gradient-to-r from-purple-400 to-blue-400 text-white font-medium hover:opacity-90 rounded-lg shadow-md transition-all"
                >
                📷 Tải ảnh lên
            </button>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleUploadAvatar}
                    className="hidden"
                />
            </div>

            <div className="space-y-4">
              <div>
                <label className="font-semibold text-gray-700">Email</label>
                <input
                  type="text"
                  name="mail"
                  value={user.mail}
                  disabled
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-500"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Tên người dùng</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Vai trò</label>
                <select
                  name="role"
                  value={user.role}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-purple-400"
                >
                  <option value="STAFF">Staff</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MANAGER">Manager</option>
                </select>
              </div>

              <button
                onClick={handleUpdateProfile}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 rounded-lg shadow-xl transition-all hover:scale-105"
              >
                💾 Lưu thay đổi
              </button>
            </div>
          </div>
        )}

        {/* Nội dung tab Đổi mật khẩu */}
        {tab === "password" && (
          <div className="p-4 space-y-4">
            <input
              type="password"
              placeholder="Mật khẩu cũ"
              onChange={(e) =>
                setPasswordData({ ...passwordData, oldPassword: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              onChange={(e) =>
                setPasswordData({
                  ...passwordData,
                  confirmPassword: e.target.value,
                })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleChangePassword}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white p-3 rounded-lg shadow-xl transition-all hover:scale-105"
            >
              🔐 Đổi mật khẩu
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
