"use client";
import { useState } from "react";
import { Star, StarOff, MoreVertical, X } from "lucide-react";
import Swal from "sweetalert2";
import { getValidAccessToken } from "@/untils/getToken";

function Tag({ name, onRemove }) {
  return (
    <span className="flex items-center px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full mr-1 mb-1">
      #{name}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 hover:text-red-600">
          <X size={12} />
        </button>
      )}
    </span>
  );
}

export default function EmailItem({ email, tagAll }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tags, setTags] = useState(email.tags ?? []); // ✅ Mảng Long
  const [newTagId, setNewTagId] = useState("");
  const [starred, setStarred] = useState(email.type === 0);
  const unread = email.isUnread;

  // ✅ Hàm lấy tên tag từ id
  const getTagNameById = (id) => {
    const foundTag = tagAll.find((t) => t.id === id);
    return foundTag ? foundTag.key : "Không rõ";
  };

  // ✅ Thêm tag
  const handleAddTag = async () => {
    if (!newTagId) {
      Swal.fire("Lỗi!", "Không thể thêm.", "error");
      return;
    }
    try {
      const token = await getValidAccessToken();
      const response = await fetch(`http://localhost:8080/tag/addTagToMail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idTag: newTagId,
          mailID: email.id,
        }),
      });

      if (response.ok) {
        const tagIdNum = parseInt(newTagId);
        if (!tags.includes(tagIdNum)) {
          setTags([...tags, tagIdNum]);
        }
        setNewTagId("");
        Swal.fire("Thành công!", "Thêm thành công.", "success");
      } else {
        Swal.fire("Lỗi!", "Có lỗi xảy ra.", "error");
      }
    } catch (error) {
      console.error("Lỗi ", error);
      Swal.fire("Lỗi!", "Có lỗi xảy ra.", "error");
    }
  };


  // ✅ Xóa tag
  const handleRemoveTag = async (id_tagRemove) => {
    try {
      const token = await getValidAccessToken();
      const response = await fetch(`http://localhost:8080/tag/removeTagFromMail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          idTag: id_tagRemove,
          mailID: email.id,
        }),
      });

      if (response.ok) {
        const tagIdNum = parseInt(id_tagRemove);
        setTags(tags.filter((id) => id !== tagIdNum));

        Swal.fire("Thành công!", "Đã xóa tag khỏi email.", "success");
      } else {
        Swal.fire("Lỗi!", "Có lỗi xảy ra.", "error");
      }
    } catch (error) {
      console.error("Lỗi ", error);
      Swal.fire("Lỗi!", "Có lỗi xảy ra.", "error");
    }
  };

  const safeTags = tags ?? [];

  return (
    <li
      className={`relative group flex items-start px-4 py-3 mb-2 rounded-lg cursor-pointer border transition-all duration-200
      ${unread ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200 hover:bg-gray-50"}
      hover:shadow-md`}
    >
      {/* Left star icon */}
      <button
        onClick={() => setStarred(!starred)}
        className="text-gray-400 hover:text-yellow-500 mr-3"
      >
        {starred ? (
          <Star className="fill-yellow-400 text-yellow-400" size={18} />
        ) : (
          <StarOff size={18} />
        )}
      </button>

      {/* Main content */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">
            {email.userTo}
          </span>

          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">
              {new Date(email.createAt).toLocaleString()}
            </span>
            <div className="relative">
              <button
                className="p-1 rounded hover:bg-gray-200"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <MoreVertical size={16} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-2">
                  <button
                    onClick={() => {
                      setEditing(true);
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left text-sm p-1 hover:bg-gray-100 rounded"
                  >
                    ✏️ Quản lý tag
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject */}
        <p className="text-sm font-medium text-gray-900 truncate">
          {email.subject}
        </p>

        {/* Tags */}
        {((safeTags.length > 0) || editing) && (
          <div className="mt-1">
            <div className="flex flex-wrap">
              {(expanded ? safeTags : safeTags.slice(0, 4)).map((tagId) => (
                <Tag
                  key={tagId}
                  name={getTagNameById(tagId)}
                  onRemove={editing ? () => handleRemoveTag(tagId) : null}
                />
              ))}

              {!expanded && safeTags.length > 4 && (
                <button
                  onClick={() => setExpanded(true)}
                  className="px-2 text-xs text-blue-500 hover:underline"
                >
                  +{safeTags.length - 4} thêm
                </button>
              )}
            </div>

            {/* Tag Editing */}
            {editing && (
              <div className="mt-2 flex items-center gap-2">
                <select
                  value={newTagId}
                  onChange={(e) => setNewTagId(e.target.value)}
                  className="border px-2 py-1 text-xs rounded w-40"
                >
                  <option value="">-- Chọn tag --</option>
                  {tagAll.map((t) => (
                    <option
                      key={t.id}
                      value={t.id}
                      disabled={safeTags.includes(t.id)} // disable nếu đã có
                    >
                      {t.key}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddTag}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Đóng
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
