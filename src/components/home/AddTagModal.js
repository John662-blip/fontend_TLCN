"use client";
import { useState } from "react";
import { PlusCircle, X } from "lucide-react";
import { getValidAccessToken } from "@/untils/getToken";

export default function AddTagModal({ onClose, LoadTags }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [autoLabel, setAutoLabel] = useState("off");
  const handleSave = async  () => {
    if (description.trim().split(" ").length < 50) {
      alert("Mô tả phải có tối thiểu 50 từ!");
      return;
    }
    let isAutoTagging = false 
    if (autoLabel == "on") isAutoTagging = true
    try {
      let token = await getValidAccessToken()
      const response = await fetch("http://localhost:8080/tag/addTag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        key: name,
        description: description,
        isAutoTagging: isAutoTagging,
      })
    });
      if (response.ok){
        LoadTags()
        onClose();
        Swal.fire("Thành công!", "Nhãn đã được cập nhập", "success");
      }
      else{
        const data = await response.json();
        console.log("Lỗi ", data);
      }
    } catch (error) {
      console.log("Lỗi ", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 transform transition-all scale-100 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-gray-800">Thêm nhãn mới</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tên nhãn */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tên nhãn
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
            placeholder="Ví dụ: Quan trọng, Công việc..."
          />
        </div>

        {/* Mô tả */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả (tối thiểu 50 từ)
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
            placeholder="Nhập mô tả chi tiết về nhãn..."
          />
        </div>

        {/* Auto label */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chế độ đánh nhãn tự động
          </label>
          <select
            value={autoLabel}
            onChange={(e) => setAutoLabel(e.target.value)}
            className="block w-full rounded-xl border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 outline-none text-sm"
          >
            <option value="off">Tắt</option>
            <option value="on">Bật</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md hover:opacity-90 transition"
          >
            <PlusCircle className="w-4 h-4" />
            Lưu
          </button>
        </div>
      </div>

      {/* animation keyframe */}
      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
