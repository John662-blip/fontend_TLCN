"use client";
import Image from "next/image";
export default function UserMenu() {
  return (
    <div className="flex items-center space-x-4 text-gray-700">
      {/* Help, Settings, Apps */}
      {/* Copy các button SVG tương tự HTML gốc */}
      <button aria-label="User account" className="relative rounded-full focus:outline-none">
        <Image
            src="https://storage.googleapis.com/a1aa/image/e2e7fb5f-8572-4e94-79c4-ff78374b2214.jpg"
            alt="User avatar"
            width={40}
            height={40}
            className="rounded-full border-2 border-white"
            />
      </button>
    </div>
  );
}
