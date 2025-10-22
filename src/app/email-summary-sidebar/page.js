"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const mockEmails = [
  { date: "2025-10-15", type: "HOP", content: "Triển khai kế hoạch Q4" },
  { date: "2025-10-15", type: "KHACH_HANG", content: "Yêu cầu báo giá sản phẩm A" },
  { date: "2025-10-16", type: "LIEN_HOAN", content: "Team building cuối năm" },
  { date: "2025-10-16", type: "HOP", content: "Báo cáo tiến độ dự án" },
  { date: "2025-10-17", type: "KHACH_HANG", content: "Gửi hợp đồng cho đối tác" }
];

const typeStyles = {
  HOP: "bg-blue-50 border-blue-300 text-blue-700",
  LIEN_HOAN: "bg-yellow-50 border-yellow-300 text-yellow-700",
  KHACH_HANG: "bg-green-50 border-green-300 text-green-700",
};

export default function SummaryPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");

  const filteredEmails = useMemo(() => {
    const now = dayjs();
    if (filter === "ALL") return mockEmails;

    return mockEmails.filter((email) => {
      const emailDate = dayjs(email.date);
      if (filter === "WEEK") {
        const startOfWeek = now.startOf("week");
        const endOfWeek = now.endOf("week");
        return emailDate.isBetween(startOfWeek, endOfWeek, null, "[]");
      }
      if (filter === "MONTH") {
        return emailDate.month() === now.month() && emailDate.year() === now.year();
      }
    });
  }, [filter]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Tóm tắt mail</h1>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          Quay về trang chủ
        </button>
      </div>

      <div className="mb-4">
        <label className="mr-2 font-medium">Lọc theo:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border px-3 py-2 rounded-md"
        >
          <option value="ALL">Tất cả</option>
          <option value="WEEK">Tuần này</option>
          <option value="MONTH">Tháng này</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredEmails.length === 0 ? (
          <div className="text-gray-500">Không có email nào</div>
        ) : (
          filteredEmails.map((email, index) => {
            const style = typeStyles[email.type] || "bg-gray-50 border-gray-300 text-gray-700";
            return (
              <div
                key={index}
                className={`border rounded-lg p-4 shadow-sm ${style}`}
              >
                <div className="text-sm text-gray-500 mb-1">📅 {email.date}</div>
                <div className="font-semibold uppercase">{`[${email.type.replace("_", " ")}]`}</div>
                <div className="text-gray-800 mt-1">{email.content}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
