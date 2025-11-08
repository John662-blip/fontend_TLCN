"use client"
import Image from "next/image";
import Header from "@/components/Header";
import Sidebar from "@/components/home/Sidebar";
import EmailList from "@/components/home/EmailList";
import ComposeEmail from "@/components/home/ComposeEmail";
import { useState,useEffect } from "react";
import AddTagModal from "@/components/home/AddTagModal";
import { getValidAccessToken } from "@/untils/getToken";
import { Client } from '@stomp/stompjs';
import SockJS from "sockjs-client";

export default function SentMails() {
  const [showCompose, setShowCompose] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [tag,setTag] = useState([])
  const [loading, setLoading] = useState(false);
  const [emails, setEmails] = useState([]); 
  const [pageInfo, setPageInfo] = useState({ size: 10, number: 0, totalElements: 0, totalPages: 0, });
  const [stompClient, setStompClient] = useState(null);
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

    let clientInstance;
    
    const setupWebSocket = async () => {
      const token = await getValidAccessToken();
      const response = await fetch("http://localhost:8080/user/getInfor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      const userEmail = data.mail;

      const socket = new SockJS("http://localhost:8080/ws");
      clientInstance = new Client({
        webSocketFactory: () => socket,
        connectHeaders: { Authorization: `Bearer ${token}` },
        onConnect: () => {
          console.log("✅ WebSocket connected"+` /topic/mail/sent/${userEmail}`);
          clientInstance.subscribe(`/topic/mail/sent/${userEmail}`, (message) => {
            const mail = JSON.parse(message.body);
            console.log(mail)
            setEmails((prev) => {
              const exists = prev.some((m) => m.id === mail.id);
              if (exists) return prev;
              return [mail, ...prev];
            });
          });
        },
        onStompError: (frame) => console.error("❌ STOMP error:", frame),
        onWebSocketError: (err) => console.error("❌ WebSocket error:", err),
      });

      clientInstance.activate();
      setStompClient(clientInstance);
    };

    setupWebSocket();

    // 🧹 Cleanup khi rời trang
    return () => {
      if (clientInstance) {
        console.log("❌ Disconnecting WebSocket...");
        clientInstance.deactivate();
      }
    };
  }, []);
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollHeight - scrollTop <= clientHeight + 5) { 
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
      <div
        className="flex-grow flex flex-col h-full overflow-hidden ml-20"
      >
        <EmailList handleScroll={handleScroll} emails={emails} tags={tag} type={1} />
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
