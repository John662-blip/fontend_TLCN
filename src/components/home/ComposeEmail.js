"use client";
import { useState } from "react";

export default function ComposeEmail({ onClose }) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);

  const handleSend = (e) => {
    e.preventDefault();

    console.log("Sending email:", { to, subject, body, attachments });

    alert(`Email sent to ${to}!`);

    setTo("");
    setSubject("");
    setBody("");
    setAttachments([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
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

      <h2 className="text-xl font-semibold mb-4">Compose Email</h2>
      <form onSubmit={handleSend} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="To"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />
        <textarea
          placeholder="Body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        {/* Upload file */}
        <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
            Attach files
        </label>

        {/* Nút chọn file đẹp */}
        <label className="inline-flex items-center px-3 py-2 bg-indigo-50 border border-indigo-200 rounded-md cursor-pointer text-indigo-600 hover:bg-indigo-100 transition">
            📎 Add Attachment
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
          className="self-end bg-indigo-500 text-white px-6 py-2 rounded-md hover:bg-indigo-600 transition"
        >
          Send
        </button>
      </form>
    </div>
    </div>
  );
}
