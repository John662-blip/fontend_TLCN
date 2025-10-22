"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getValidAccessToken } from "@/untils/getToken";
import Swal from "sweetalert2";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [tab, setTab] = useState("info");

  // 👤 Thông tin người dùng
  const [user, setUser] = useState({
    mail: "",
    name: "",
    avatar: "",
    role: "",
    avatarFile: null, // ✅ dùng để theo dõi ảnh mới
  });

  // 🔒 Dữ liệu đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 🧠 Khi chọn ảnh mới
  const handleUploadAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setUser((prev) => ({
        ...prev,
        avatar: imageUrl,
        avatarFile: file, // ✅ lưu file để upload
      }));
    }
  };

  // 🧭 Load thông tin từ backend
  const LoadTags = async () => {
    try {
      let token = await getValidAccessToken();
      const response = await fetch("http://localhost:8080/user/getInfor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();

        // map role từ số sang text
        let roleText = "";
        if (data.role === 2) roleText = "STAFF";
        else if (data.role === 1) roleText = "MANAGER";
        else roleText = "ADMIN";

        setUser({
          mail: data.mail,
          name: data.name,
          avatar: "http://localhost:8080/public/image/" + data.avatar,
          role: roleText,
          avatarFile: null, 
        });

        console.log("Phản hồi từ server:", data);
      } else {
        console.error("Lỗi khi gọi API:", response.status);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  useEffect(() => {
    LoadTags();
  }, []);
  const roleMap = {
    "ADMIN": 0,
    "MANAGER": 1,
    "STAFF": 2,
  };

  // 🧩 Cập nhật thông tin người dùng
  const handleUpdateProfile = async () => {
    if (user.name.length==0){
      Swal.fire("Lỗi!", "Tên không được để trống", "error");
      return
    }
    try {
      const token = await getValidAccessToken();
      const formData = new FormData();

      formData.append("name", user.name);
      formData.append("role", roleMap[user.role]);

      // ✅ nếu user chọn ảnh mới thì gửi file, còn không thì gửi null
      if (user.avatarFile) {
        formData.append("avatar", user.avatarFile);
      }

      const response = await fetch("http://localhost:8080/user/changeInfor", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUser((prev) => ({
          ...prev,
          avatarFile: null,
        }));
        Swal.fire("Thành công!", "Cập nhập thành công.", "success");
      } else {
        Swal.fire("Lỗi!", "Có lỗi xảy ra.", "error");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      Swal.fire("Lỗi!", "Có lỗi xảy ra.", "error");
    }
  };

  // 🔐 Đổi mật khẩu
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire("Lỗi!", "Có lỗi xảy ra.", "error");
      return;
    }
    try {
      const token = await getValidAccessToken();
      const formData = new FormData();

      const response = await fetch("http://localhost:8080/user/changePassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      }),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        })
        Swal.fire("Thành công!", "Cập nhập thành công.", "success");
      } else {
        Swal.fire("Lỗi!", "Có lỗi xảy ra.", "error");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      Swal.fire("Lỗi!", "Có lỗi xảy ra.", "error");
    }
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

        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          👤 Hồ Sơ Cá Nhân
        </h1>

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

        

        {/* Tab Thông tin cá nhân */}
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
                  onChange={(e) =>
                    setUser({ ...user, [e.target.name]: e.target.value })
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700">Vai trò</label>
                <select
                  disabled
                  name="role"
                  value={user.role}
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

        {/* Tab Đổi mật khẩu */}
        {tab === "password" && (
          <div className="p-4 space-y-4">
            <input
              type="password"
              placeholder="Mật khẩu cũ"
              value={passwordData.oldPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, oldPassword: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Mật khẩu mới"
              value={passwordData.newPassword}
              onChange={(e) =>
                setPasswordData({ ...passwordData, newPassword: e.target.value })
              }
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Xác nhận mật khẩu mới"
              value={passwordData.confirmPassword}
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
