import { Paperclip, X, ArrowDownCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useRef, useState } from "react";
import Swal from "sweetalert2";
import { getValidAccessToken } from "@/untils/getToken";
import API_CONFIG from "@/untils/Config";

export default function ReplyBox({
  inforUser,
  isLoadSuggest,
  text,
  setText,
  replyText,
  files,
  onAttach,
  onRemove,
  onCancel,
  suggestions,
  refreshSuggestions,
  defaultBody = "", 
  mailTo,
  email,
  setReplyFiles
}) {
  const textareaRef = useRef(null);
  const [showBody, setShowBody] = useState(false);
  const [isGenReply, setGenReply] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const handleClickAction = async(action)=>{
    setGenReply(true)
    try {
      setText("");
      let token = await getValidAccessToken()
      const response = await fetch(
        `${API_CONFIG.AI_URL}/reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            action : action,
            message: `Người gửi : ${inforUser.userFrom.name} <${inforUser.userFrom.mail}> \n Người Nhận : ${inforUser.userTo.name} <${inforUser.userTo.mail}> \n chủ đề :${email.subject}\n nội dung : ${email.content}` 
          }),
        }
      );
      if (response.ok){
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });

          // Mỗi chunk có thể chứa nhiều dòng "data: ..."
          const lines = chunk.split("\n").filter(line => line.trim().startsWith("data: "));

          for (const line of lines) {
            const jsonStr = line.replace("data: ", "").trim();
            if (jsonStr === "[DONE]") continue; // Dòng kết thúc stream

            try {
              const dataObj = JSON.parse(jsonStr);
              if (dataObj.reply) {
                // Nối thêm text stream vào nội dung
                setText(prev => prev + dataObj.reply + " ");
              }
            } catch (err) {
              console.warn("Lỗi parse JSON:", jsonStr);
            }
          }
        }

      }
      else{
        const data = await response.json();
        console.log("Lỗi ", data);
      }
    } catch (error) {
      console.log("Lỗi ", error);
    }
    setGenReply(false)
  }

  const handleFocus = () => {
    // Đưa con trỏ lên đầu
    setTimeout(() => {
      if (textareaRef.current) textareaRef.current.setSelectionRange(0, 0);
    }, 0);
  };

  const handleSend = async (e) => {
      e.preventDefault();
      setIsSending(true);
  
      const formData = new FormData();
      formData.append("to", mailTo);
      formData.append("subject", `RE : ${email.subject}`);
      formData.append("body", `${replyText} \n \n \n ${defaultBody}`);
  
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
          setReplyFiles([])
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
      {/* Gợi ý hành động */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleClickAction(s)}
              disabled={isGenReply} 
              className={`px-3 py-1 border rounded-full text-xs transition ${
                isGenReply
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          onClick={refreshSuggestions}
          disabled={isLoadSuggest} 
          className={`flex items-center gap-1 text-xs px-3 py-1 border rounded-md 
            ${isLoadSuggest ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-white hover:bg-gray-100"}`}
        >
          <ArrowDownCircle size={14} /> Làm mới
        </button>
      </div>

      {/* Ô nhập nội dung trả lời */}
      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={handleFocus}
        rows={8}
        placeholder="Nhập phản hồi của bạn ở đây..."
        className="w-full p-3 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      {/* Phần thư trước */}
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
      <div className="mt-3 flex justify-between">
        <label className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded-md cursor-pointer hover:bg-gray-100 text-sm">
          <Paperclip size={16} />
          <span>Đính kèm</span>
          <input type="file" multiple onChange={onAttach} className="hidden" />
        </label>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            onClick={(e)=>handleSend(e)}
            disabled={isSending}
          >
            {isSending ? "Đang gửi..." : "Gửi"}
          </button>
          <button
            onClick={onCancel}
            className="px-3 py-2 bg-white border rounded-md hover:bg-gray-50 text-sm"
            disabled={isSending}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
