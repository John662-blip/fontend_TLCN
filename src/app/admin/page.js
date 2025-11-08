"use client";

import { useState, useEffect, useRef } from "react";
import { getValidAccessToken } from "@/untils/getToken";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function Page() {
  const router = useRouter();

  const [users, setUsers] = useState([
  ]);
  const [isAdmin,setAdmin] = useState(false)

  const [searchEmail, setSearchEmail] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const checkAdmin = async () => {
    try {
      const token = await getValidAccessToken();
      const response = await fetch(`http://localhost:8080/user/isAdmin`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data === true);
      } 
    } catch (error) {
      console.log("Lỗi ", error);
    }
  }

  const handelLoadUsers = async () => {
    try {
      const token = await getValidAccessToken();
      const response = await fetch(`http://localhost:8080/user/getAll`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data)
      } 
    } catch (error) {
      console.log("Lỗi ", error);
    }
  }
  const handelChangeStatus = async(mail)=>{
     try {
      const token = await getValidAccessToken();
      const response = await fetch(`http://localhost:8080/user/changeActive`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mail })
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(prev =>
        prev.map(u =>
          u.mail === mail ? { ...u, is_active: !u.is_active } : u
        )
      );
      Swal.fire("Thành công!", "Đã thay đổi trạng thái.", "success");


      } 
      else{
        Swal.fire("Lỗi!", "Không thể đổi.", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể đổi.", "error");
      console.log("Lỗi ", error);
    }
  }

  useEffect(() => {
    handelLoadUsers();
    checkAdmin();
  }, []);

  const [showAddUser, setShowAddUser] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const openChangePasswordModal = (user) => {
    setCurrentUser(user);
    setShowChangePass(true);
  };

  const handleChangeRole = async (id, newRole) => {
    try {
      const token = await getValidAccessToken();
      const response = await fetch(`http://localhost:8080/user/changeType`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: id,
          type: newRole
        })
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(prev =>
        prev.map(u =>
          u.mail === id ? { ...u, role: data.role } : u
        )
      );
      Swal.fire("Thành công!", "Đã thay đổi trạng thái.", "success")
      } 
      else{
        Swal.fire("Lỗi!", "Không thể đổi.", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể đổi.", "error");
      console.log("Lỗi ", error);
    }
  };

  const handleAddUser = async(e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.username.value.trim();
    const fullname = form.fullname.value.trim();
    const password = form.password.value.trim();
    const confirm = form.confirm.value.trim();
    const role = parseInt(form.role.value);

    if (username.includes("@") || username.includes(" ")) {
      Swal.fire("Lỗi!", "Tên đăng nhập không được chứa '@' hoặc khoảng trắng.", "error");
      return;
    }

    if (!username || !fullname || !password || !confirm) {
      Swal.fire("Lỗi!", "Phải nhập đủ thông tin.", "error");
      return
    }

    if (password !== confirm) {
      Swal.fire("Lỗi!", "Mật khẩu xác nhận không khớp!", "error");
      return
    } 
    if (avatarFile==null) {
      Swal.fire("Lỗi!", "Phải có ảnh đại diện", "error");
      return
    } 
    try {
      const token = await getValidAccessToken();
      const formData = new FormData();
      formData.append("mail", `${username}@cntt.local`);
      formData.append("password", password);
      formData.append("name", fullname);
      formData.append("role", role);
      formData.append("avatar", avatarFile);
      const response = await fetch("http://localhost:8080/user/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData
      });

      if (response.ok) {
        Swal.fire("Thành công!", "Đã thêm user mới.", "success");
        handelLoadUsers()
        setAvatarPreview("");
        setAvatarFile(null);
        setShowAddUser(false);

      } else {
        const err = await response.json();
        Swal.fire("Lỗi!", err.message || "Không thể thêm user", "error");
      }
    } catch (error) {
      console.log(error);
      Swal.fire("Lỗi!", "Không thể thêm user", "error");
    }
    setAvatarPreview("");
    setAvatarFile(null);
    setShowAddUser(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const form = e.target;
    const newPass = form.password.value.trim();
    const confirmPass = form.confirm.value.trim();
    const mail = currentUser.mail
    if (!newPass || !confirmPass){
      Swal.fire("Lỗi!", "Phải nhập đủ thông tin.", "error");
      return
    }
    if (newPass !== confirmPass){
      Swal.fire("Lỗi!", "Mật khẩu xác nhận không khớp!", "error");
      return
    } 
    try {
      const token = await getValidAccessToken();
      const response = await fetch(`http://localhost:8080/user/changePasswordAd`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mail: mail,
          newPassword: newPass
        })
      });

      if (response.ok) {
        Swal.fire("Thành công!", "Cập nhập thành công", "success")
      } 
      else{
        Swal.fire("Lỗi!", "Không thể đổi.", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Không thể đổi.", "error");
      console.log("Lỗi ", error);
    }

    setShowChangePass(false);
  };
  
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-2">🚫 Không có quyền truy cập</h1>
          <p className="text-gray-700 mb-4">Bạn cần quyền admin để vào trang này.</p>
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }
  else{
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="mb-4">
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            🏠 Quay lại trang chủ
          </button>
        </div>
        <h1 className="text-2xl font-bold mb-6">🎛 Admin Dashboard</h1>

        {/* User Management */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-3 gap-3">
            <h2 className="text-xl font-semibold">Quản lý Account</h2>

            <input
              type="text"
              placeholder="Tìm email..."
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              className="border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={() => setShowAddUser(true)}
              >
                + Thêm User
              </button>

              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handelLoadUsers}
              >
                🔄 Reload
              </button>
            </div>
          </div>

          <div className="overflow-auto max-h-120 bg-white shadow rounded">
            <table className="w-full table-auto">
              <thead className="bg-gray-200">
                <tr>
                  <th className="border px-2 py-1 sticky top-0 bg-gray-200 z-10">Mail</th>
                  <th className="border px-2 py-1 sticky top-0 bg-gray-200 z-10">Họ và tên</th>
                  <th className="border px-2 py-1 sticky top-0 bg-gray-200 z-10">Vai Trò</th>
                  <th className="border px-2 py-1 sticky top-0 bg-gray-200 z-10">Trạng thái</th>
                  <th className="border px-2 py-1 sticky top-0 bg-gray-200 z-10">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter(u => u.mail.toLowerCase().includes(searchEmail.toLowerCase()))
                  .map(u => (
                    <tr key={u.mail}>
                      <td className="border px-2 py-1">{u.mail}</td>
                      <td className="border px-2 py-1">{u.name}</td>
                      <td className="border px-2 py-1">
                        <select
                          value={u.role}
                          onChange={(e) => handleChangeRole(u.mail, e.target.value)}
                          className="border border-gray-300 rounded p-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                          <option value={0}>Admin</option>
                          <option value={2}>Staff</option>
                        </select>
                      </td>
                      <td className="border px-2 py-1">{u.is_active ? "✅ Hoạt động" : "🔒 Đã khóa"}</td>
                      <td className="border px-2 py-1 flex gap-2">
                        <button
                          className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
                          onClick={() => openChangePasswordModal(u)}
                        >
                          Đổi mật khẩu
                        </button>
                        <button
                          className={`px-2 py-1 rounded ${!u.is_active ? "bg-red-500 text-white hover:bg-red-600" : "bg-green-500 text-white hover:bg-green-600"}`}
                          onClick={() => handelChangeStatus(u.mail)}
                        >
                          {!u.is_active ? "Mở khóa" : "Khóa"}
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Add User Modal */}
        {showAddUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h3 className="text-xl font-bold mb-4 text-center">✨ Thêm User Mới</h3>
              <form className="flex flex-col gap-3" onSubmit={handleAddUser}>
                <div className="flex justify-center mb-2">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">Chọn ảnh</div>
                    )}
                  </div>
                </div>
                <input name="username" placeholder="Nhập tên (ví dụ: hungp, tự động thêm @cntt.local)" className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input name="fullname" placeholder="Họ và tên" className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <select name="role" className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value={0}>Admin</option>
                  <option value={2}>Staff</option>
                </select>
                <input type="password" name="password" placeholder="Mật khẩu" className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input type="password" name="confirm" placeholder="Xác nhận mật khẩu" className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <input type="file" accept="image/*" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    setAvatarFile(file);
                    reader.onload = (ev) => setAvatarPreview(ev.target.result);
                    reader.readAsDataURL(file);
                  }
                }} className="border border-gray-300 rounded-lg p-2 cursor-pointer" />
                <div className="flex justify-end gap-2 mt-3">
                  <button type="button" onClick={() => { setShowAddUser(false); setAvatarPreview(""); setAvatarFile(null)}} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">Hủy</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">Thêm</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Change Password Modal */}
        {showChangePass && currentUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-96">
              <h3 className="text-xl font-bold mb-2 text-center">Đổi mật khẩu: {currentUser.mail}</h3>
              <form onSubmit={handleChangePassword}>
                <input
                  name="password"
                  placeholder="Mật khẩu mới"
                  type="password"
                  className="border border-gray-300 rounded-lg p-2 w-full mb-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <input
                  name="confirm"
                  placeholder="Xác nhận mật khẩu"
                  type="password"
                  className="border border-gray-300 rounded-lg p-2 w-full mb-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={() => setShowChangePass(false)} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400">Hủy</button>
                  <button type="submit" className="px-4 py-2 rounded-lg bg-yellow-400 hover:bg-yellow-500">Lưu</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }
}
