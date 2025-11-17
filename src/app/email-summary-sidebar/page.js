"use client";
import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);
import { getValidAccessToken } from "@/untils/getToken";
import API_CONFIG from "@/untils/Config";

const typeStyles = {
  0: "bg-blue-50 border-blue-300 text-blue-700",
  1: "bg-yellow-50 border-yellow-300 text-yellow-700",
  2: "bg-green-50 border-green-300 text-green-700",
};
const categoryMap = {
  0: "HỌP",
  1: "NHIỆM VỤ",
  2: "SỰ KIỆN VUI CHƠI"
};

export default function SummaryPage() {
  const router = useRouter();
  const [mails, setMails] = useState([]);
  const [filter, setFilter] = useState("WEEK");
  const [activeCategory, setActiveCategory] = useState("ALL"); // ALL, 0, 1, 2

  const hasLoad = useRef(false);
  const hasFetchedSummary = useRef(false);

  // Load mail theo khoảng thời gian
  const handelLoadMail = async (range = "WEEK") => {
    try {
      const token = await getValidAccessToken();
      const response = await fetch(`http://localhost:8080/mail/filterMail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ range })
      });

      if (response.ok) {
        const data = await response.json();
        setMails(data);
        hasFetchedSummary.current = false;
      } 
    } catch (error) {
      console.log("Lỗi ", error);
    }
  }

  // Load summary cho tất cả mail
  const handleLoadSummary = async () => {
    try {
      let tg_mail = mails.map(mail => `
        Chủ đề : ${mail.subject}
        Nội dung :
        ${mail.content}
      `.trim());

      if (tg_mail.length === 0) return;

      const token = await getValidAccessToken();
      const response = await fetch(`${API_CONFIG.AI_URL}/summarize_batch_20`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ list_content: tg_mail })
      });

      if (response.ok) {
        const data = await response.json();
        const updatedMails = mails.map((mail, idx) => ({
          ...mail,
          summary: data.list_summary[idx] || ""
        }));
        setMails(updatedMails);
      }
    } catch (error) {
      console.log("Lỗi ", error);
    }
  }

  // Load mail lần đầu
  useEffect(() => {
    if (!hasLoad.current) {
      handelLoadMail(filter);
      hasLoad.current = true;
    }
  }, []);

  // Load summary khi mails thay đổi
  useEffect(() => {
    if (mails.length > 0 && !hasFetchedSummary.current) {
      handleLoadSummary();
      hasFetchedSummary.current = true;
    }
  }, [mails]);

  // Lọc mail theo tab memo
  const filteredMails = useMemo(() => {
    if (activeCategory === "ALL") return mails;
    return mails.filter(mail => mail.category === activeCategory);
  }, [mails, activeCategory]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Tóm tắt mail</h1>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Quay về trang chủ
        </button>
      </div>

      {/* Filter khoảng thời gian */}
      <div className="mb-4 flex gap-4 items-center">
        <div>
          <label className="mr-2 font-medium">Lọc theo:</label>
          <select
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              handelLoadMail(e.target.value);
            }}
            className="border px-3 py-2 rounded-md"
          >
            <option value="WEEK">7 ngày gần nhất</option>
            <option value="MONTH">Tháng này</option>
            <option value="PREVIOUS_MONTH">Tháng trước</option>
          </select>
        </div>

        {/* Tabs memo */}
        <div className="flex gap-2">
          {["ALL", 0, 1, 2].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-md font-medium ${
                activeCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {cat === "ALL" ? "Tất cả" : categoryMap[cat]}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách mail */}
      <div className="space-y-4">
        {filteredMails.length === 0 ? (
          <div className="text-gray-500">Không có email nào</div>
        ) : (
          filteredMails.map((email) => {
            const style = typeStyles[email.category] || "bg-gray-50 border-gray-300 text-gray-700";
            return (
              <div
                key={email.id}
                className={`border rounded-lg p-4 shadow-sm ${style}`}
              >
                <div className="text-sm text-gray-500 mb-1">
                  📅 {dayjs(email.createAt).format("DD/MM/YYYY HH:mm")}
                </div>
                <div className="font-semibold uppercase">{`[${categoryMap[email.category] || "KHÁC"}]`}</div>
                <div
                  className="text-lg font-bold text-gray-900 mb-1 cursor-pointer"
                  onClick={() => router.push(`/mail/${email.id}`)}
                >
                  {email.subject}
                </div>
                <div className="text-gray-800 mt-1">
                  {email.summary ? email.summary : "Đang load..."}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
