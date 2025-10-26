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
        const data = await response.json(); // data sẽ là true/false
        setEmail({
          content : data.content,
          createAt:formatDate(data.createAt),
          subject: data.subject,
          attachments:[]
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
  const mail = {
    subject: "Meeting Reminder — Project Sync",
    senderName: "Boss Example",
    senderEmail: "boss@example.com",
    senderAvatar: "https://randomuser.me/api/portraits/men/75.jpg",
    time: "24 thg 10 2025, 10:05",
    to: "you@example.com",
    body: `Hi team,

    This is a quick reminder about our sync meeting tomorrow at 10:00 AM in the main conference room.

    Agenda:
    - Project updates
    - Timeline review
    - Open discussion

    Thanks,
    Boss

    `, // Lặp lại nội dung để tạo nội dung dài
        attachments: [
          { name: "agenda.pdf", url: "#" },
          { name: "timeline.xlsx", url: "#" },
        ],
      };

  const relatedMails = [
    {
      id: "r1",
      subject: "Project Sync Notes",
      sender: "Boss Example",
      time: "22 thg 10",
      preview: "Here are the meeting notes and key takeaways...",
    },
    {
      id: "r2",
      subject: "Timeline Adjustment for Sprint 3",
      sender: "PM Alice",
      time: "20 thg 10",
      preview: "Due to delays, we’ll extend the testing phase by 2 days...",
    },
  ];

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
  const [suggestions, setSuggestions] = useState([
    "Cảm ơn bạn!",
    "Tôi sẽ kiểm tra và phản hồi sớm.",
    "Đã nhận được thông tin.",
    "Hẹn gặp bạn trong cuộc họp.",
  ]);

  // Handlers
  const onAttachFiles = (e, type) => {
    const files = Array.from(e.target.files);
    if (type === "reply") setReplyFiles((prev) => [...prev, ...files]);
    else setForwardFiles((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeFile = (type, idx) => {
    if (type === "reply")
      setReplyFiles((prev) => prev.filter((_, i) => i !== idx));
    else setForwardFiles((prev) => prev.filter((_, i) => i !== idx));
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

  return (
    <div className="h-[calc(100vh-76px)] bg-gray-100 flex">
      <div className="flex-1 mx-auto max-w-6xl flex bg-white rounded-xl shadow overflow-hidden">
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
                onClick={() => setShowRelated((s) => !s)}
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
                    href={"file.url"}
                    className="inline-flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm hover:bg-gray-200"
                  >
                    <Paperclip size={14} />
                    {file.name}
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
                  text={replyText}
                  setText={setReplyText}
                  files={replyFiles}
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
                  onAttach={(e) => onAttachFiles(e, "forward")}
                  onRemove={(i) => removeFile("forward", i)}
                  onCancel={() => setIsForwardOpen(false)}
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
                  <div className="text-xs text-gray-600">{m.sender} • {m.time}</div>
                  <div className="text-xs text-gray-500 truncate mt-1">{m.preview}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}