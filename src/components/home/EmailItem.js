// EmailItem.js
"use client";
import { useState } from "react";
import Image from "next/image";

function Tag({ name, onRemove }) {
  return (
    <span className="flex items-center px-2 py-0.5 text-xs bg-indigo-100 text-indigo-600 rounded-full mr-1 mb-1">
      {name}
      {onRemove && (
        <button onClick={onRemove} className="ml-1 text-red-500 hover:text-red-700">✕</button>
      )}
    </span>
  );
}

export default function EmailItem({ email }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tags, setTags] = useState(email.tags || []);
  const [newTag, setNewTag] = useState("");
  const [starred, setStarred] = useState(email.isStarred || false);
  const unread = email.isUnread;

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, { id: Date.now(), name: newTag }]);
      setNewTag("");
    }
  };

  const removeTag = (id) => {
    setTags(tags.filter((t) => t.id !== id));
  };

  return (
    <li
      className={`relative flex items-start px-3 py-3 mb-2 rounded-md transition-all duration-150 cursor-pointer
        ${unread ? "bg-indigo-50 border-l-4 border-indigo-500" : "bg-white border border-gray-100"}
        hover:bg-gray-50 hover:shadow`}
    >
      {/* Avatar */}
      <Image
        src="https://i.pravatar.cc/32"
        alt="avatar"
        width={32}
        height={32}
        className="rounded-full mr-2 flex-shrink-0"
      />

      {/* Nội dung */}
      <div className="flex flex-col flex-grow">
        {/* Header: sender + star + time + menu */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setStarred(!starred)}
              className={`text-lg ${starred ? "text-yellow-500" : "text-gray-300 hover:text-yellow-400"}`}
            >
              ★
            </button>
            <span className="text-sm font-semibold text-gray-800">{email.sender}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{email.time}</span>

            {/* Menu */}
            <div className="relative">
              <button onClick={() => setMenuOpen(!menuOpen)} className="px-1 text-gray-500 hover:text-gray-700">⋮</button>
              {menuOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white border rounded shadow-md text-xs z-10">
                  <button
                    onClick={() => { setEditing(true); setMenuOpen(false); }}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    Sửa tag
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Subject */}
        <p className="text-sm font-bold text-gray-900 line-clamp-1">{email.subject}</p>

        {/* Snippet */}
        <p className={`text-xs ${unread ? "text-gray-700 font-medium" : "text-gray-500"} line-clamp-2`} style={{ overflowWrap: "anywhere" }}>
          {email.body}
        </p>

        {/* Tags + Edit */}
        {(tags.length > 0 || editing) && (
          <div className="mt-1">
            <div className={`flex ${expanded ? "flex-wrap" : "flex-nowrap overflow-hidden"}`}>
              {(expanded ? tags : tags.slice(0, 5)).map(tag => (
                <Tag key={tag.id} name={tag.name} onRemove={editing ? () => removeTag(tag.id) : null} />
              ))}

              {!expanded && tags.length > 5 && (
                <button onClick={() => setExpanded(true)} className="px-1 text-xs text-gray-500 hover:text-indigo-600">...</button>
              )}
            </div>

            {expanded && tags.length > 5 && !editing && (
              <button onClick={() => setExpanded(false)} className="mt-1 px-1 text-xs text-red-500 hover:text-red-700">Ẩn bớt</button>
            )}

            {editing && (
              <div className="mt-1 flex items-center gap-1">
                <input
                  type="text"
                  value={newTag}
                  onChange={e => setNewTag(e.target.value)}
                  className="px-1 py-0.5 text-xs border rounded"
                  placeholder="Thêm tag..."
                />
                <button onClick={addTag} className="px-2 py-0.5 text-xs bg-indigo-500 text-white rounded hover:bg-indigo-600">Thêm</button>
                <button onClick={() => setEditing(false)} className="px-2 py-0.5 text-xs text-green-600 hover:text-green-800">Lưu tag</button>
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
