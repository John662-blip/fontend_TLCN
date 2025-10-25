"use client";
import Sidebar from "@/components/home/Sidebar";
import MailDetail from "@/components/mail/MailDetail";
import Header from "@/components/Header";
import ComposeEmail from "@/components/home/ComposeEmail";
import { useState,useEffect,use } from "react";
import AddTagModal from "@/components/home/AddTagModal";
import { getValidAccessToken } from "@/untils/getToken";

export default function MailPage({ params }) {
  const [showCompose, setShowCompose] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [tag,setTag] = useState([])
  const LoadTags = async  () => {
    try {
      let token = await getValidAccessToken()
      const response = await fetch("http://localhost:8080/tag/getListTag", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });
      if (response.ok){
        const data = await response.json();
        setTag(data)
        // console.log("Phản hồi từ server:", data);
      }
    } catch (error) {
      console.log("Lỗi ", error);
    }
  };
  useEffect(() => {
      LoadTags();
      },[]);
  
  return (
    <div className="bg-[#f1f3f4] min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-grow overflow-hidden relative">
        <Sidebar
               onAddTag = {()=>setShowAddTag(true)} 
               tags = {tag} 
               onNewMail={() => setShowCompose(true)} 
               LoadTags={() => LoadTags()}
               activeMenu="None"
                />
        <div className="flex-grow flex flex-col h-full overflow-hidden">
        {/* Scroll riêng cho MailDetail */}
        <div className="flex-1 overflow-y-auto ">
          <MailDetail params={params} />
        </div>
      </div>
        {showCompose && (
          <div className="fixed bottom-4 right-4 z-50">
            <ComposeEmail onClose={() => setShowCompose(false)} />
          </div>
        )}
        {showAddTag && (
          <div className="fixed bottom-4 right-4 z-50">
          <AddTagModal
            onClose={() => setShowAddTag(false)}
            LoadTags={() => LoadTags()}
            
          />
          </div>
        )}
      </main>
    </div>
  );
}
