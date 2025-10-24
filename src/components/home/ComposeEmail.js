"use client";
import { useState } from "react";
import { getValidAccessToken } from "@/untils/getToken";
import Swal from "sweetalert2";
export default function ComposeEmail({ onClose }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;


  const handleSend = async (e) => {
    e.preventDefault();
    setIsSending(true);

    const formData = new FormData();
    formData.append("to", to);
    formData.append("subject", subject);
    formData.append("body", body);

    attachments.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      const token = await getValidAccessToken()

      const response = await fetch("http://localhost:8080/mail/sent", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, 
        },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setTo("");
        setSubject("");
        setBody("");
        setAttachments([]);
        onClose();
        Swal.fire("Thành công!", "Gửi thành công.", "success");
      } else {
         Swal.fire("Lỗi!", "Có lỗi xãy ra khi gửi", "error");
         setIsSending(false);
      }
    } catch (error) {
      console.log(error)
      Swal.fire("Lỗi!", "Có lỗi xãy ra khi gửi", "error");
      setIsSending(false);
    }
  };


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = [];
    files.forEach((file) => {
    if (file.size > MAX_FILE_SIZE) {
    Swal.fire(
        "File quá lớn!",
        `${file.name} vượt quá dung lượng cho phép 5MB.`,
          "warning"
        );
      } else {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      setAttachments((prev) => [...prev, ...validFiles]);
    }
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 w-[600px] max-w-3xl">
    <div className=" relative max-w-2xl w-full p-6 border rounded-lg shadow-lg bg-white">
      {/* Nút đóng */}
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
      >
        ✖
      </button>

      <h2 className="text-xl font-semibold mb-4">Thư mới</h2>
      <form onSubmit={handleSend} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Đến"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="text"
          placeholder="Chủ đề"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <textarea
          placeholder="Nội dung"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* Upload file */}
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Tài liệu đính kèm
        </label>

        {/* Nút chọn file đẹp */}
        <label className="inline-flex items-center px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-md cursor-pointer text-indigo-600 hover:bg-indigo-100 transition">
            📎 Đính kèm tệp
            <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden" // ẩn input file mặc định
            />
        </label>

        {/* Hiển thị file đã chọn */}
        <div className="mt-3 flex flex-wrap gap-3">
            {attachments.map((file, index) => (
            <div
                key={index}
                className="flex items-center gap-2 px-3 py-2 border rounded-md bg-gray-50 text-sm"
            >
                {/* Nếu là ảnh thì preview */}
                {file.type.startsWith("image/") ? (
                <img
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="w-12 h-12 object-cover rounded"
                />
                ) : (
                <span className="text-gray-700">{file.name}</span>
                )}
                <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="text-red-500 hover:text-red-700"
                >
                ✖
                </button>
            </div>
            ))}
        </div>
        </div>

        <button
          type="submit"
          disabled={isSending}
          className={`self-end px-6 py-2 rounded-md transition text-white ${
            isSending ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          {isSending ? "Đang gửi..." : "Gửi"}
        </button>
      </form>
    </div>
    </div>
  );
}
