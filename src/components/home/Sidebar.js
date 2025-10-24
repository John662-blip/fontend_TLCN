"use client";
import { useState } from "react";
import Swal from "sweetalert2";
import {
  Inbox,
  Send,
  Star,
  Tag as TagIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Pencil,
  MoreVertical 
} from "lucide-react";
import ChangeTagModel from "./ChangeTagModel";
import { getValidAccessToken } from "@/untils/getToken";
import { useRouter,usePathname } from "next/navigation";

export default function Sidebar({
  onNewMail,
  tags,
  onAddTag,
  LoadTags,
  activeMenu,
  activeTagId,
  setActiveMenu,
  setActiveTagId,
}) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [openTagMenu, setOpenTagMenu] = useState(null);
  const [isOpenChangeTag, setIsOpenChangeTag] = useState(false);
  const [selectedTagId, setSelectedTagId] = useState(null);
  const pathname = usePathname();

  const handleEditTag = (id) => {
    setSelectedTagId(id);
    setIsOpenChangeTag(true);
    setOpenTagMenu(false);
  };

  const handleCloseModal = () => {
    setIsOpenChangeTag(false);
    setSelectedTagId(null);
  };

  const handleDeleteTag = async (idTag) => {
    setOpenTagMenu(false);
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Nhãn này sẽ bị xóa vĩnh viễn!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#e02424",
      cancelButtonColor: "#6b7280",
    });

    if (!result.isConfirmed) return;

    try {
      let token = await getValidAccessToken();
      const response = await fetch("http://localhost:8080/tag/deleteTag", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ idTag }),
      });

      if (response.ok) {
        Swal.fire("Đã xóa!", "Nhãn đã được xóa thành công.", "success");
        LoadTags();
      } else {
        Swal.fire("Lỗi!", "Không thể xóa nhãn.", "error");
      }
    } catch (error) {
      Swal.fire("Lỗi!", "Có lỗi xảy ra.", "error");
    }
  };
  const handleSelectMenu = (menu) => {
    const routes = {
      inbox: "/",
      sent: "/sent-mails",
      star: "/star",
      tag: null, // Tag xử lý riêng phía dưới
    };

    const target = routes[menu];

    if (menu === "tag") {
      // xử lý tag riêng bằng handleSelectTag
      return;
    }

    if (pathname === target) {
      // Nếu đang ở đúng route -> refresh trang
      router.refresh();
    } else {
      // Nếu khác route -> chuyển trang
      router.push(target);
    }
  };

 

  const handleSelectTag = (tagId) => {
    // setActiveMenu("tag");
    // setActiveTagId(tagId);
  };

  const getMenuClass = (menu) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 transition cursor-pointer ${
      activeMenu === menu ? "bg-gray-700" : "hover:bg-gray-700"
    }`;

  const getTagClass = (id) =>
    `flex items-center justify-between rounded-lg px-3 py-2 transition cursor-pointer ${
      activeMenu === "tag" && activeTagId === id ? "bg-gray-700" : "hover:bg-gray-700"
    }`;

  return (
    <>
      <nav
        className={`flex flex-col bg-gray-900 text-white transition-all duration-300 ${
          collapsed ? "w-20" : "w-90"
        } px-3 py-4 select-none h-[calc(100vh-80px)] relative shadow-lg`}
      >
        {!collapsed && (
          <button
            onClick={onNewMail}
            className="flex items-center gap-2 bg-indigo-600 rounded-xl px-4 py-3 mb-6 font-medium text-sm w-full hover:bg-indigo-500 shadow-md transition"
          >
            <Pencil className="w-5 h-5" /> Soạn thư
          </button>
        )}

        <ul className="flex flex-col gap-1 text-sm font-medium">
          <li onClick={() => handleSelectMenu("inbox")} className={getMenuClass("inbox")}>
            <Inbox className="w-5 h-5" /> {!collapsed && "Hộp thư đến"}
          </li>
          <li onClick={() => handleSelectMenu("sent")} className={getMenuClass("sent")}>
            <Send className="w-5 h-5" /> {!collapsed && "Thư đã gửi"}
          </li>
          <li onClick={() => handleSelectMenu("star")} className={getMenuClass("star")}>
            <Star className="w-5 h-5" /> {!collapsed && "Thư quan trọng"}
          </li>
        </ul>

        {!collapsed && (
          <div className="mt-6 flex-1 overflow-y-auto pr-1">
            <h3 className="px-3 text-xs uppercase text-gray-400 font-semibold mb-2 tracking-wide">Nhãn</h3>
            <ul className="flex flex-col gap-1 text-sm font-medium">
              {tags.map((tag) => (
                <li key={tag.id} className="relative group">
                  <div onClick={() => handleSelectTag(tag.id)} className={getTagClass(tag.id)}>
                    <div className="flex items-center gap-2">
                      <TagIcon className="w-4 h-4 text-gray-300" /> {tag.key}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenTagMenu(openTagMenu === tag.id ? null : tag.id);
                      }}
                      className="p-1 rounded hover:bg-gray-600"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>

                  {openTagMenu === tag.id && (
                    <div className="absolute right-0 mt-1 w-32 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
                      <button
                        className="block w-full text-left px-4 py-2 hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleEditTag(tag.id)}
                      >
                        Sửa Tag
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
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

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute bottom-4 right-2 p-2 text-gray-400 hover:text-white rounded-full bg-gray-800 hover:bg-gray-700 transition"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </nav>

      {isOpenChangeTag && (
        <ChangeTagModel onClose={handleCloseModal} LoadTags={LoadTags} idTag={selectedTagId} />
      )}
    </>
  );
}
