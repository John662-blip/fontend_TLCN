"use client";
import Image from "next/image";
import UserSidebar from "./UserSidebar";
import { useState } from "react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-center space-x-4 text-gray-700">
      <button aria-label="User account" className="relative rounded-full focus:outline-none cursor-pointer"
        onClick={()=>setOpen(true)}
      >
        <Image
            src="https://storage.googleapis.com/a1aa/image/e2e7fb5f-8572-4e94-79c4-ff78374b2214.jpg"
            alt="User avatar"
            width={40}
            height={40}
            className="rounded-full border-2 border-white"
            />
      </button>
      {open && <UserSidebar onClose={() => setOpen(false)} />}
    </div>
  );
}
