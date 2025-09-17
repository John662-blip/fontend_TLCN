"use client";
import { User, CalendarDays, LogOut } from "lucide-react";

export default function UserSidebar({ onClose }) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-white/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 w-72 h-full bg-white shadow-xl z-50 flex flex-col animate-slideIn">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Tùy chọn</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            ✕
          </button>
        </div>

        {/* Danh sách hành động */}
        <div className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <button className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                <User className="w-5 h-5 text-indigo-500" />
                <span>Thông tin cá nhân</span>
              </button>
            </li>
            <li>
              <button className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                <CalendarDays className="w-5 h-5 text-green-500" />
                <span>Sự kiện trong tuần</span>
              </button>
            </li>
          </ul>

          {/* Divider */}
          <hr className="my-4 border-gray-200" />

          <ul>
            <li>
              <button className="flex items-center gap-3 w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50 transition">
                <LogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
