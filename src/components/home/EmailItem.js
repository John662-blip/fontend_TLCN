"use client";
import { useState } from "react";
import { Star, StarOff, MoreVertical, X } from "lucide-react";

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

export default function EmailItem({ email }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tags, setTags] = useState(email.tags || []);
  const [newTag, setNewTag] = useState("");
  const [starred, setStarred] = useState(email.type === 0);
  const unread = email.isUnread;

  const addTag = () => {
    if (newTag.trim()) {
      setTags([...tags, { id: Date.now(), name: newTag }]);
      setNewTag("");
    }
  };

  const removeTag = (id) => setTags(tags.filter((t) => t.id !== id));

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
        {starred ? <Star className="fill-yellow-400 text-yellow-400" size={18}/> : <StarOff size={18}/>}
      </button>

      {/* Main content */}
      <div className="flex flex-col flex-grow">
        {/* Header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-800 truncate max-w-[200px]">
            {email.userTo}
          </span>
          
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">{new Date(email.createAt).toLocaleString()}</span>
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
        {(tags.length > 0 || editing) && (
          <div className="mt-1">
            <div className={`flex flex-wrap`}>
              {(expanded ? tags : tags.slice(0, 4)).map((tag) => (
                <Tag key={tag.id} name={tag.name} onRemove={editing ? () => removeTag(tag.id) : null} />
              ))}
              {!expanded && tags.length > 4 && (
                <button
                  onClick={() => setExpanded(true)}
                  className="px-2 text-xs text-blue-500 hover:underline"
                >
                  +{tags.length - 4} thêm
                </button>
              )}
            </div>

            {/* Tag Editing */}
            {editing && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nhập tên tag..."
                  className="border px-2 py-1 text-xs rounded w-32"
                />
                <button
                  onClick={addTag}
                  className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Thêm
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-3 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                  Lưu
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
