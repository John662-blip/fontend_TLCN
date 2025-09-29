"use client";
import { useState } from "react";
import {
  Inbox,
  Send,
  Star,
  Tag,
  Plus,
  ChevronLeft,
  ChevronRight,
  Pencil,
} from "lucide-react";

export default function Sidebar({ onNewMail, tags, onAddTag }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <nav
      className={`flex flex-col bg-gray-900 text-white transition-all duration-300
      ${collapsed ? "w-20" : "w-128"} px-3 py-4 select-none h-[calc(100vh-80px)] relative shadow-lg`}
    >
      {/* Compose */}
      {!collapsed && (
        <button
          onClick={onNewMail}
          className="flex items-center gap-2 bg-indigo-600 rounded-xl px-4 py-3 mb-6 font-medium text-sm w-full 
            hover:bg-indigo-500 shadow-md transition"
        >
          <Pencil className="w-5 h-5" />
          Soạn thư
        </button>
      )}

      {/* Menu */}
      <ul className="flex flex-col gap-1 text-sm font-medium">
        <li>
          <a
            className="flex items-center gap-3 rounded-lg px-3 py-2 bg-gray-800 hover:bg-gray-700 transition"
            href="#"
          >
            <Inbox className="w-5 h-5" />
            {!collapsed && (
              <>
                Hộp thư đến
                <span className="ml-auto text-xs font-normal text-gray-400">
                  1,406
                </span>
              </>
            )}
          </a>
        </li>
        <li>
          <a
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-700 transition"
            href="#"
          >
            <Send className="w-5 h-5" />
            {!collapsed && (
              <>
                Thư đã gửi
                <span className="ml-auto text-xs font-normal text-gray-400">
                  750
                </span>
              </>
            )}
          </a>
        </li>
        <li>
          <a
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-700 transition"
            href="#"
          >
            <Star className="w-5 h-5" />
            {!collapsed && (
              <>
                Thư quan trọng
                <span className="ml-auto text-xs font-normal text-gray-400">
                  14
                </span>
              </>
            )}
          </a>
        </li>
      </ul>

      {/* Tags */}
      {!collapsed && (
        <div className="mt-6 flex-1 overflow-y-auto pr-1">
          <h3 className="px-3 text-xs uppercase text-gray-400 font-semibold mb-2 tracking-wide">
            Nhãn
          </h3>
          <ul className="flex flex-col gap-1 text-sm font-medium">
            {tags.map((tag) => (
              <li key={tag.id}>
                <a
                  className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-700 transition"
                  href="#"
                >
                  <Tag className="w-4 h-4 text-gray-300" /> {tag.name}
                </a>
              </li>
            ))}
            <li>
              <button
                onClick={onAddTag}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-indigo-400 hover:bg-gray-700 w-full text-left transition"
              >
                <Plus className="w-4 h-4" /> Thêm nhãn
              </button>
            </li>
          </ul>
        </div>
      )}

      {/* Toggle collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute bottom-4 right-2 p-2 text-gray-400 hover:text-white rounded-full bg-gray-800 hover:bg-gray-700 transition"
      >
        {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </nav>
  );
}
