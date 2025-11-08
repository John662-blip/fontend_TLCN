"use client";
import { useState } from "react";
import {
  Reply,
  CornerDownRight,
  MoreVertical,
  Mail,
  Paperclip,
} from "lucide-react";
import Link from "next/link";
import ReplyBox from "./ReplyBox";
import ForwardBox from "./ForwardBox";
import { useEffect } from "react";
import { getValidAccessToken } from "@/untils/getToken";
import { formatDate } from "@/untils/formatDate";
import Swal from "sweetalert2";

export default function MailDetail({ id }) {
  const [email,setEmail] = useState({
    content : "",
    createAt:"",
    subject:"",
    attachments:[]
  })
  const [inforUser,setInforUser] = useState(
    {
    userTo: {
        mail: "",
        name: "",
        avatar: ""
    },
    userFrom: {
        mail: "",
        name: "",
        avatar: ""
    }
}
  )
  const LoadMail = async ()=>{
    try {
      let token = await getValidAccessToken();
      const response = await fetch(`http://localhost:8080/mail/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json(); 
        setEmail({
          content : data.content,
          createAt:formatDate(data.createAt),
          subject: data.subject,
          attachments:data.attach_Files
        })
        
      } else {
        console.log("Lỗi từ server:", response.status);
      }
    } catch (error) {
      console.log("Lỗi khi gọi API:", error);
    }
  }
  const LoadUser = async ()=>{
    try {
      let token = await getValidAccessToken();
      const response = await fetch(`http://localhost:8080/user/getInforUserFromIdMailRespose?idMail=${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json(); // data sẽ là true/false
        setInforUser(data)
      } else {
        console.log("Lỗi từ server:", response.status);
      }
    } catch (error) {
      console.log("Lỗi khi gọi API:", error);
    }
  }
  useEffect(() => {
    LoadMail(),
    LoadUser()
  },[]);
 
  
  // States
  const [showSummary, setShowSummary] = useState(false);
  const [summaryContent] = useState(
    "Cuộc họp ngày mai lúc 10AM để thảo luận tiến độ dự án, timeline và các vấn đề mở."
  );
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isForwardOpen, setIsForwardOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [forwardText, setForwardText] = useState("");
  const [replyFiles, setReplyFiles] = useState([]);
  const [forwardFiles, setForwardFiles] = useState([]);
  const [showRelated, setShowRelated] = useState(false);
  const [relatedMails,setRelatedMails] = useState([]);
  const [suggestions, setSuggestions] = useState([
    "Cảm ơn bạn!",
    "Tôi sẽ kiểm tra và phản hồi sớm.",
    "Đã nhận được thông tin.",
    "Hẹn gặp bạn trong cuộc họp.",
  ]);
  const handleClickshowRelated = async()=>{
    try {
      let token = await getValidAccessToken()
      const response = await fetch(
        `http://localhost:8080/ai/getMailsRelate?idMail=${id}&topk=${8}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      if (response.ok){
        const data = await response.json();
        setRelatedMails(data)
      }
      else{
        const data = await response.json();
        console.log("Lỗi ", data);
      }
    } catch (error) {
      console.log("Lỗi ", error);
    }
  }
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  // Handlers
  const onAttachFiles = (e, type) => {
    const files = Array.from(e.target.files);

    // Lọc file >0 byte
    const validFiles = files.filter(file => file.size > 0);
    if (validFiles.length === 0) return;

    if (type === "reply") {
      const totalSize = [...replyFiles, ...validFiles].reduce((acc, f) => acc + f.size, 0);
      if (totalSize > MAX_FILE_SIZE) {
        Swal.fire(
                "File quá lớn!",
                `Tổng file vượt quá dung lượng cho phép 5MB.`,
                  "warning"
                );
        return;
      }
      setReplyFiles(prev => [...prev, ...validFiles]);
    } else {
      const totalSize = [...forwardFiles, ...validFiles].reduce((acc, f) => acc + f.size, 0);
      if (totalSize > MAX_FILE_SIZE) {
        Swal.fire(
                "File quá lớn!",
                `Tổng file vượt quá dung lượng cho phép 5MB.`,
                  "warning"
                );
        return;
      }
      setForwardFiles(prev => [...prev, ...validFiles]);
    }

    e.target.value = ""; // reset input
  };

  const removeFile = (type, idx) => {
    if (type === "reply")
      setReplyFiles((prev) => prev.filter((_, i) => i !== idx));
    else setForwardFiles((prev) => prev.filter((_, i) => i !== idx));
  };
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0'); // 2 chữ số
    const month = date.getMonth() + 1; // JS month từ 0 → +1
    return `${day} thg ${month}`; 
  };

  const refreshSuggestions = () => {
    const pool = [
      "Cảm ơn bạn rất nhiều!",
      "Tôi sẽ xem lại và báo cáo.",
      "Tôi đồng ý với nội dung trên.",
      "Chúng ta sẽ bàn thêm trong cuộc họp.",
      "Tôi đã nhận được, cảm ơn bạn.",
      "Đã hiểu, cảm ơn bạn!",
    ];
    const newSuggestions = pool.sort(() => 0.5 - Math.random()).slice(0, 4);
    setSuggestions(newSuggestions);
  };

  const toggleSummary = () => setShowSummary((s) => !s);
  const handleDowload = async (name,fileName)=>{
    try {
      let token = await getValidAccessToken();
      const response = await fetch(`http://localhost:8080/download/${encodeURIComponent(name)}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName; 
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.log("Lỗi từ server:", response.status);
      }
    } catch (error) {
      console.log("Lỗi khi gọi API:", error);
    }
  }

  return (
    <div className="h-[calc(100vh-76px)] bg-gray-100 flex">
      <div className="absolute top-0 left-0 right-0 bottom-0 bg-white z-40 flex overflow-hidden ml-20">

        {/* MAIL DETAIL */}
        <div
          className={`flex-1 flex flex-col h-[calc(100vh-76px)] overflow-hidden transition-all duration-300 ${
            showRelated ? "max-w-[calc(100%-20rem)]" : "w-full"
          }`}
        >
          {/* Nội dung cuộn */}
          <div className="flex-1 overflow-y-auto">
            {/* HEADER */}
            <div className="px-6 py-5 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h1 className="text-2xl font-semibold text-gray-900">{email.subject}</h1>
              <button
                onClick={() => {
                  handleClickshowRelated()
                  setShowRelated((s) => !s)}
                }
                className="flex items-center gap-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm text-gray-700"
              >
                <Mail size={16} />
                {showRelated ? "Ẩn mail liên quan" : "Hiển thị mail liên quan"}
              </button>
            </div>

            {/* SENDER ROW */}
            <div className="px-6 py-4 flex justify-between items-start gap-4">
              <div className="flex items-start gap-4">
                <img
                  src={"http://localhost:8080/public/image/"+inforUser.userFrom.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                  alt={inforUser.userFrom.name || "User"}
                  className="w-12 h-12 rounded-full object-cover border"
                  onError={(e) => {
                    e.currentTarget.onerror = null; 
                    e.currentTarget.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png"; 
                  }}
                />
                <div>
                  <div className="font-medium text-gray-900">
                    {inforUser.userFrom.name}{" "}
                    <span className="text-gray-500 font-normal">&lt;{inforUser.userFrom.mail}&gt;</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">to {inforUser.userTo.name} <span className="text-gray-500 font-normal">&lt;{inforUser.userTo.mail}&gt;</span> • {email.createAt}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsReplyOpen((s) => !s);
                    setIsForwardOpen(false);
                  }}
                  title="Phản hồi"
                  className="p-2 hover:bg-gray-100 rounded-md text-gray-600"
                >
                  <Reply size={18} />
                </button>
                <button
                  onClick={() => {
                    setIsForwardOpen((s) => !s);
                    setIsReplyOpen(false);
                  }}
                  title="Chuyển tiếp"
                  className="p-2 hover:bg-gray-100 rounded-md text-gray-600"
                >
                  <CornerDownRight size={18} />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>

            {/* BODY */}
            <div className="px-6 py-6 text-gray-800 whitespace-pre-line leading-relaxed">{email.content}</div>

            {/* ATTACHMENTS */}
            {email.attachments.length > 0 && (
              <div className="px-6 py-4 border-t flex flex-wrap gap-2">
                {email.attachments.map((file, idx) => (
                  <a
                    key={idx}
                    onClick={()=>handleDowload(file.storagePath,file.fileName)}
                    className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm hover:bg-gray-200 cursor-pointer"
                  >
                    <Paperclip size={14} />
                    {file.fileName}
                  </a>
                ))}
              </div>
            )}
             {/* SMART SUMMARY */}
            {showSummary && (
              <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
                <div className="flex justify-between items-start">
                  <h2 className="text-sm font-semibold text-yellow-800 flex items-center gap-2">
                    📌 Tóm tắt thông minh
                  </h2>
                  <button onClick={toggleSummary} className="text-xs text-gray-500 hover:text-gray-700">
                    Ẩn
                  </button>
                </div>
                <p className="mt-2 text-gray-700 leading-relaxed">{summaryContent}</p>
              </div>
            )}

            {/* ACTIONS */}
            <div className="px-6 py-4 border-t flex items-center gap-3">
              <button
                onClick={() => {
                  setIsReplyOpen((s) => !s);
                  setIsForwardOpen(false);
                }}
                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
              >
                <Reply size={16} /> Phản hồi
              </button>
              <button
                onClick={() => {
                  setIsForwardOpen((s) => !s);
                  setIsReplyOpen(false);
                }}
                className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm"
              >
                <CornerDownRight size={16} /> Chuyển tiếp
              </button>
              <button
                onClick={toggleSummary}
                className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-md text-sm text-yellow-800"
              >
                <Mail size={16} /> Tóm tắt email
              </button>
            </div>

            {/* REPLY BOX */}
            {isReplyOpen && (
              <div className="sticky bottom-0 bg-white z-10 px-6 py-4 border-t">
                <ReplyBox
                  email = {email}
                  mailTo = {inforUser.userFrom.mail}
                  text={replyText}
                  setText={setReplyText}
                  replyText = {replyText}
                  files={replyFiles}
                  setReplyFiles = {setReplyFiles}
                  onAttach={(e) => onAttachFiles(e, "reply")}
                  onRemove={(i) => removeFile("reply", i)}
                  onCancel={() => setIsReplyOpen(false)}
                  refreshSuggestions={refreshSuggestions}
                  suggestions={suggestions}
                  defaultBody={`---------- Re: message ----------\nFrom: ${inforUser.userFrom.name}<${inforUser.userFrom.mail}> \nSubject: ${email.subject}\nDate: ${email.createAt}\nTo: ${inforUser.userTo.name}\n\n${email.content}\n\n-------------------------------\n`}
                />
              </div>
            )}

            {/* FORWARD BOX */}
            {isForwardOpen && (
              <div className="sticky bottom-0 bg-white z-10 px-6 py-4 border-t">
                <ForwardBox
                  text={forwardText}
                  setText={setForwardText}
                  files={forwardFiles}
                  setForwardFiles = {setForwardFiles}
                  onAttach={(e) => onAttachFiles(e, "forward")}
                  onRemove={(i) => removeFile("forward", i)}
                  onCancel={() => setIsForwardOpen(false)}
                  email={email}
                  defaultBody={`---------- Forwarded message ----------\nFrom: ${inforUser.userFrom.name} <${inforUser.userFrom.mail}>\nSubject: ${email.subject}\nDate: ${email.createAt}\nTo: ${inforUser.userTo.mail}\n\n${email.content}\n\n-------------------------------\n`}
                />
              </div>
            )}
          </div>
        </div>

        {/* RELATED MAILS */}
        {showRelated && (
          <div className="w-80 border-l bg-gray-50 flex flex-col">
            <div className="px-4 py-3 border-b font-medium text-gray-700">✉️ Mail liên quan</div>
            <div className="flex-1 overflow-y-auto">
              {relatedMails.map((m) => (
                <Link
                  key={m.id}
                  href={`/mail/${m.id}`}
                  className="block px-4 py-3 border-b hover:bg-gray-100 transition"
                >
                  <div className="text-sm font-medium text-gray-900 truncate">{m.subject}</div>
                  <div className="text-xs text-gray-600">{m.userFromName} • {formatDate(m.createAt)}</div>
                  <div className="text-xs text-gray-500 truncate mt-1">{m.content}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}