"use client";
import Image from "next/image";
import UserSidebar from "./UserSidebar";
import { useState } from "react";
import { getValidAccessToken } from "@/untils/getToken";
import { useEffect } from "react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);
  const [imageUrl,setImageUrl] = useState("https://storage.googleapis.com/a1aa/image/e2e7fb5f-8572-4e94-79c4-ff78374b2214.jpg")
  const LoadImage = async () => {
      try {
        let token = await getValidAccessToken();
        const response = await fetch("http://localhost:8080/user/getInfor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.ok) {
          const data = await response.json();
  
  
          setImageUrl("http://localhost:8080/public/image/" + data.avatar);
          console.log(imageUrl)
        } else {
          console.error("Lỗi khi gọi API:", response.status);
        }
      } catch (error) {
        console.error("Lỗi:", error);
      }
    };
    useEffect(() => {
        LoadImage()
      }, []);
  return (
    <div className="flex items-center space-x-4 text-gray-700">
      <button
        aria-label="User account"
        className="relative w-12 h-12 rounded-full overflow-hidden cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
          <Image
            src={imageUrl}
            alt="User avatar"
            width={48}
            height={48}
            className="object-cover w-full h-full"
          />
        </div>
      </button>
      {open && <UserSidebar onClose={() => setOpen(false)} />}
    </div>
  );
}
