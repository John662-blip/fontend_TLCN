"use client";
import Image from "next/image";
import SearchBar from "./SearchBar";
import UserMenu from "./UserMenu";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter()
  return (
   <header className="flex items-center w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 sticky top-0 z-30">
  {/* Left */}
  <div className="flex-1">
    <button
      type="button"
      onClick={()=>router.push("/")}
      className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-indigo-500 transition cursor-pointer text-white"
    >
      <Image
        src="/images/mail_icon.png"
        alt="App logo"
        width={36}
        height={36}
        className="rounded-lg border border-white"
      />
      <span className="font-semibold text-lg">MailBox</span>
    </button>
  </div>

  {/* Center */}
  {/* <div className="flex-[3] flex justify-center">
    <SearchBar />
  </div> */}

  {/* Right */}
  <div className="flex-1 flex justify-end">
    <UserMenu />
  </div>
</header>
  );
}
