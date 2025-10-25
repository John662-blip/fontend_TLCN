import { Paperclip, X, ArrowDownCircle } from "lucide-react";
import { useRef, useEffect } from "react";

export default function ReplyBox({
  text,
  setText,
  files,
  onAttach,
  onRemove,
  onCancel,
  suggestions,
  refreshSuggestions,
  defaultBody = "",
}) {
  const handleFocus = () => {
    if (defaultBody && !text) setText(defaultBody);
    setTimeout(() => {
      if (textareaRef.current) {
        const len = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(len, len); 
      }
    }, 0);
  };
  const handleSetText = (newText) => {
    setText(defaultBody+newText);
    setTimeout(() => {
        if (textareaRef.current) {
          const len = textareaRef.current.value.length;
          textareaRef.current.setSelectionRange(len, len); 
        }
      }, 0);
};
  const textareaRef = useRef(null);

  return (
    <div className="px-6 py-4 border-t bg-gray-50">
      {/* Gợi ý hành động */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSetText(s)}
              className="px-3 py-1 bg-white border rounded-full text-xs hover:bg-gray-100 transition"
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={refreshSuggestions}
          className="flex items-center gap-1 text-xs px-3 py-1 border rounded-md bg-white hover:bg-gray-100"
        >
          <ArrowDownCircle size={14} /> Làm mới
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleFocus}
        rows={20}
        placeholder="Trả lời..."
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

      <div className="mt-3 flex justify-between">
        <label className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-md cursor-pointer hover:bg-gray-100 text-sm">
          <Paperclip size={16} />
          <span>Đính kèm</span>
          <input type="file" multiple onChange={onAttach} className="hidden" />
        </label>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            Gửi
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50 text-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
