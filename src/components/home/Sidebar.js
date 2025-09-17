"use client";
import Image from "next/image";
export default function Sidebar({onNewMail }) {
  return (
<nav className="flex flex-col bg-gray-900 text-white w-120 px-3 py-4 select-none">
  <button 
    onClick={onNewMail} 
    className="flex items-center gap-2 bg-indigo-600 rounded-lg px-4 py-3 mb-4 font-medium text-sm w-full hover:bg-indigo-500">
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="19" y2="5"></line>
      <line x1="5" x2="19" y1="12" y2="12"></line>
    </svg>
    Soạn thư
  </button>
  <ul className="flex flex-col gap-2 text-sm font-medium">
    <li>
      <a className="flex items-center gap-3 rounded-md px-3 py-2 bg-gray-800 hover:bg-gray-700" href="#">
        <span className="text-2xl">📥</span> 
        Hộp thư đến
        <span className="ml-auto text-xs font-normal text-gray-400">1,406</span>
      </a>
    </li>
    <li>
      <a className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-700" href="#">
        <span className="text-2xl">📤</span> 
         Thư đã gửi
         <span className="ml-auto text-xs font-normal text-gray-400">750</span>
      </a>
    </li>
    <li>
  <a className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-gray-700" href="#">
    <span className="text-2xl">⭐</span> 
    Thư quan trọng
    <span className="ml-auto text-xs font-normal text-gray-400">14</span>
  </a>
</li>

  </ul>
</nav>

  );
}
