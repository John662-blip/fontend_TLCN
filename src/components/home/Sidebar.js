"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  Inbox,
  Send,
  Star,
  Tag,
  Plus,
  ChevronLeft,
  ChevronRight,
  Pencil,
  MoreVertical 
} from "lucide-react";
import ChangeTagModel from "./ChangeTagModel";
import { getValidAccessToken } from "@/untils/getToken";
// import { useState } from "react";
export default function Sidebar({ onNewMail, tags, onAddTag ,LoadTags}) {
  const [collapsed, setCollapsed] = useState(false);
  const [openTagMenu, setOpenTagMenu] = useState(null);

  const [isOpenChangeTag, setIsOpenChangeTag] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const handleEditTag = (id) => {
    setSelectedTagId(id);
    setIsOpenChangeTag(true);
    setOpenTagMenu(false)
  };

  const handleCloseModal = () => {
    setIsOpenChangeTag(false);
    setSelectedTagId(null);
  };
  const handleDeleteTag = async (idTag) => {
    setOpenTagMenu(false)
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Nhãn này sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#e02424", // màu đỏ
      cancelButtonColor: "#6b7280",  // màu xám
    });

    if (!result.isConfirmed) return;

    try {
      let token = await getValidAccessToken();
      const response = await fetch("http://localhost:8080/tag/deleteTag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          idTag: idTag,
        })
      });

      if (response.ok) {
        Swal.fire("Đã xóa!", "Nhãn đã được xóa thành công.", "success");
        LoadTags();
      } else {
        const data = await response.json();
        console.log("Lỗi: ", data);
        Swal.fire("Lỗi!", "Không thể xóa nhãn.", "error");
      }
    } catch (error) {
      console.log("Lỗi: ", error);
      Swal.fire("Lỗi!", "Có lỗi xảy ra.", "error");
    }
  };

  return (
    <>
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
              <li key={tag.id} className="relative group">
                <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-gray-700 transition">
                  <a className="flex items-center gap-2" href="#">
                    <Tag className="w-4 h-4 text-gray-300" /> {tag.key}
                  </a>
                  <button
                    onClick={() =>
                      setOpenTagMenu(openTagMenu === tag.id ? null : tag.id)
                    }
                    className="p-1 rounded hover:bg-gray-600"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-300" />
                  </button>
                </div>

                {/* Dropdown menu */}
                {openTagMenu === tag.id && (
                  <div className="absolute right-0 mt-1 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                    <button
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700 cursor-pointer"
                      onClick={() => handleEditTag(tag.id)}
                    >
                      Sửa Tag
                    </button>
                    <button
                      onClick={() => handleDeleteTag(tag.id)} // TODO: gọi hàm thật
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700 text-red-400 cursor-pointer"
                    >
                      Xóa Tag
                    </button>
                  </div>
                )}
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
    { isOpenChangeTag && (
      <ChangeTagModel
          onClose={handleCloseModal}
          LoadTags={LoadTags} // hoặc hàm load lại danh sách
          idTag={selectedTagId}
        />
      )}
    </>
  );
  
}
