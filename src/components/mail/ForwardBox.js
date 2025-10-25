import { useState } from "react";
import { Paperclip, X } from "lucide-react";
import { useRef } from "react";

export default function ForwardBox({
  text,
  setText,
  files,
  onAttach,
  onRemove,
  onCancel,
  defaultBody,
}) {
  const textareaRef = useRef(null);
  const [toEmail, setToEmail] = useState("");

  const handleFocus = () => {
    if (defaultBody && !text) setText(defaultBody);
    setTimeout(() => {
      if (textareaRef.current) {
        const len = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(len, len); 
      }
    }, 0);
  };

  const handleForward = () => {
    if (!toEmail.trim()) {
      alert("Vui lòng nhập địa chỉ email người nhận!");
      return;
    }
    alert(`Đã chuyển tiếp mail đến: ${toEmail}`);
    onCancel();
  };

  return (
    <div className="px-6 py-4 border-t bg-gray-50">
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

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleFocus}
        rows={18}
        placeholder="Thêm nội dung trước khi chuyển tiếp..."
        className="w-full p-3 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

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
