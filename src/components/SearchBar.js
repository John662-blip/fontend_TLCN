"use client";
import Image from "next/image";

export default function SearchBar() {
  return (
    <form className="flex items-center w-full max-w-md bg-white border border-gray-300 rounded-md px-3 py-1 shadow-sm" role="search">
  <svg className="w-8 h-8 text-gray-500 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="7"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
  <input
    className="flex-grow text-gray-700 text-sm focus:outline-none"
    placeholder="Tìm kiếm"
    type="search"
  />
</form>
  );
}
