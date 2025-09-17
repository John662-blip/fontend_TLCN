"use client";
import Image from "next/image";

export default function EmailItem({ email }) {
  const unread = email.isUnread; // true = chưa đọc, false = đã đọc

  return (
    <li
      className={`flex items-start px-4 py-3 mb-2 rounded-md shadow-sm hover:shadow-md transition cursor-pointer 
        ${unread ? "bg-indigo-50 border-l-4 border-indigo-500" : "bg-white"}`}
    >
      {/* Avatar */}
      <Image
        src="https://i.pravatar.cc/32"
        alt="avatar"
        width={32}
        height={32}
        className="rounded-full mr-3 flex-shrink-0"
      />

      {/* Nội dung */}
      <div className="flex flex-col flex-grow">
        {/* Dòng trên cùng: người gửi + thời gian */}
        <div className="flex items-center justify-between">
          <span className="font-bold text-gray-900">
            {email.sender}
          </span>
          <span className="text-xs text-gray-500">{email.time}</span>
        </div>

        {/* Tiêu đề */}
        <p className="text-sm font-bold text-gray-900">
          {email.subject}
        </p>

        {/* Nội dung email */}
        <p
          className={`text-xs ${
            unread ? "text-gray-700 font-medium" : "text-gray-500"
          } line-clamp-3`}
          style={{ overflowWrap: "anywhere" }}
        >
          {email.body}
        </p>
      </div>
    </li>
  );
}
