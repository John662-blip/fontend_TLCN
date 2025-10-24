"use client"
import Image from "next/image";
import Header from "@/components/Header";
import Sidebar from "@/components/home/Sidebar";
import EmailList from "@/components/home/EmailList";
import ComposeEmail from "@/components/home/ComposeEmail";
import { useState,useEffect } from "react";
import AddTagModal from "@/components/home/AddTagModal";
import { getValidAccessToken } from "@/untils/getToken";

export default function sent_mails() {
  const [showCompose, setShowCompose] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [tag,setTag] = useState([])
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]); 
  const [pageInfo, setPageInfo] = useState({ size: 10, number: 0, totalElements: 0, totalPages: 0, });
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
  const LoadMail = async (page = 0, reset = false) => {
    if (loading) return;
    setLoading(true);

    try {
        let token = await getValidAccessToken();
        const response = await fetch(`http://localhost:8080/mail/sent-mails?page=${page}&size=${pageInfo.size}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        }
        });

        if (response.ok) {
        const data = await response.json();

        setEmails(prev => {
            const merged = reset ? data.content : [...prev, ...data.content];
            // Loại bỏ trùng
            return Array.from(new Map(merged.map(item => [item.id, item])).values());
        });

        setPageInfo(data.page);
        }
    } catch (error) {
        console.log("Lỗi ", error);
    } finally {
        setLoading(false);
    }
    };

  useEffect(() => {
    setEmails([]); // reset cũ
    setPageInfo({ size: 10, number: 0, totalElements: 0, totalPages: 0 });
    LoadTags();
    LoadMail(0, true);
  }, []);
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight) {
      if (pageInfo.number + 1 < pageInfo.totalPages) {
        LoadMail(pageInfo.number + 1); 
      }
    }
  };

  return (
    <div className="bg-[#f1f3f4] min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-grow overflow-hidden relative">
      <Sidebar
       onAddTag = {()=>setShowAddTag(true)} 
       tags = {tag} 
       onNewMail={() => setShowCompose(true)} 
       LoadTags={() => LoadTags()}
       activeMenu="sent"
        
        />
      {/* //Sửa nội dung trong này  */}
      <div className="flex-grow flex flex-col h-full overflow-hidden"
        onScroll={handleScroll}
      >
        <EmailList emails={emails} />
        {loading && <p className="text-center py-2">Đang tải...</p>}
      </div>
      {/* //Sửa nội dung */}

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
