import { Paperclip, X, ChevronDown, ChevronUp } from "lucide-react";
import { useState, useRef } from "react";
import Swal from "sweetalert2";
import { getValidAccessToken } from "@/untils/getToken";

export default function ForwardBox({
  text,
  setText,
  files,
  onAttach,
  onRemove,
  onCancel,
  defaultBody = "", // thư gốc
  onForward, // callback gửi thật
  setForwardFiles,
  email
}) {
  const [toEmail, setToEmail] = useState("");
  const [showBody, setShowBody] = useState(false);
  const textareaRef = useRef(null);
  const [isSending, setIsSending] = useState(false);

  const handleFocus = () => {
    setTimeout(() => {
      if (textareaRef.current) textareaRef.current.setSelectionRange(0, 0);
    }, 0);
  };

  const handleForward = async (e) => {
        e.preventDefault();
        if (!toEmail.trim()) {
          Swal.fire("Lỗi!", "Vui lòng nhập email người nhận!", "error");
          return;
        }

        setIsSending(true);
    
        const formData = new FormData();
        formData.append("to", toEmail);
        formData.append("subject", `Forwarded : ${email.subject}`);
        formData.append("body", `${text} \n \n \n ${defaultBody}`);
    
        files.forEach((file) => {
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
            setForwardFiles([])
            setText("")
            setIsSending(false)
            onCancel()
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
  return (
    <div className="px-6 py-4 border-t bg-gray-50">
      {/* Người nhận */}
      <label className="block text-sm font-medium text-gray-700 mb-1">
        To:
      </label>
      <input
        type="email"
        value={toEmail}
        onChange={(e) => setToEmail(e.target.value)}
        placeholder="Nhập email người nhận..."
        className="w-full p-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 mb-3"
      />

      {/* Soạn nội dung */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleFocus}
        rows={10}
        placeholder="Thêm nội dung trước khi chuyển tiếp..."
        className="w-full p-3 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Thư gốc */}
      {defaultBody && (
        <div className="mt-3 text-sm text-gray-500 border-l-2 border-gray-300 pl-3 bg-white rounded">
          <button
            onClick={() => setShowBody(!showBody)}
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
          >
            {showBody ? (
              <>
                <ChevronUp size={14} /> Ẩn thư gốc
              </>
            ) : (
              <>
                <ChevronDown size={14} /> Hiện thư gốc
              </>
            )}
          </button>
          {showBody && (
            <pre className="mt-1 whitespace-pre-wrap text-gray-600 text-xs">
              {defaultBody}
            </pre>
          )}
        </div>
      )}

      {/* File đính kèm */}
      {files.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-white border rounded-full px-3 py-1 text-sm"
            >
              <Paperclip size={14} />
              <span className="max-w-[200px] truncate">{file.name}</span>
              <button
                onClick={() => onRemove(idx)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Nút hành động */}
      <div className="mt-3 flex justify-end gap-3">
        <label className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-md cursor-pointer hover:bg-gray-100 text-sm">
          <Paperclip size={16} />
          <span>Đính kèm</span>
          <input type="file" multiple onChange={onAttach} className="hidden" />
        </label>
        <button
          onClick={handleForward}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
        >
          Chuyển tiếp
        </button>
        <button
          onClick={onCancel}
          className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50 text-sm"
        >
          Đóng
        </button>
      </div>
    </div>
  );
}
