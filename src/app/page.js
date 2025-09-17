"use client"
import Image from "next/image";
import Header from "@/components/Header";
import Sidebar from "@/components/home/Sidebar";
import EmailList from "@/components/home/EmailList";
import ComposeEmail from "@/components/home/ComposeEmail";
import { useState } from "react";
import AddTagModal from "@/components/home/AddTagModal";
const dummyEmails = [
  {
    id: "1",
    sender:  "hung59069@ga.com",
    subject: "Biên lai của bạn từ Shoppe #2685-1339",
    body: `
        Sau bước Vectorization (biểu diễn văn bản thành vector số), thường có 2 hướng xử lý:
      1. Truyền vào mô hình học máy / deep learning

        Vector (BoW, TF-IDF, word embedding, contextual embedding) → đưa vào mô hình.

        Mục tiêu: train mô hình để học ra quy luật.
        Ví dụ:

        Phân loại văn bản (spam / không spam).

        Dự đoán cảm xúc (tích cực / tiêu cực).

        Dịch máy, chatbot, sinh văn bản…
    `,
    time: "11:35",
    isUnread: true,
    isStarred:true,
    tags:[
      {
        id: 1,
        name:"mt_5"
      },
      {
        id:2,
        name : "Qwen"
      },
      {
        id: 6,
        name:"mt_51"
      },
      {
        id:7,
        name : "Deek"
      } ,
      {
        id: 8,
        name:"Ok_"
      },
      {
        id:9,
        name : "Oni"
      } 
    ]
  },
  {
    id: "ask",
    sender: "name",
    subject: "Biên lai của bạn ",
    body: "- Biên lai của bạn từ ",
    time: "11:35",
    isUnread: false,
    tags:[
      {
        id: 1,
        name:"mt_5"
      }
    ]
  },
  {
    id: "ask23",
    sender: "Hung555@cntt.local",
    subject: " OK jsfjkdfj",
    body: "- Biên lai của bạn từ ",
    time: "11:30",
    isUnread: true,
    isStarred:true,
  },
  {
    id: "asksdd",
    sender: "name",
    subject: "Biên lai của bạn ",
    body: "- Biên lai của bạn từ ",
    time: "11:35",
    isUnread: false,
    tags:[
      {
        id:2,
        name : "Qwen"
      } 
    ],
    isStarred:false,
  },
  {
    id: "ask23323",
    sender: "Hung555@cntt.local",
    subject: " OK jsfjkdfj",
    body: "- Biên lai của bạn từ ",
    time: "11:30",
    isUnread: true,
  },{
    id: "askddd",
    sender: "name",
    subject: "Biên lai của bạn ",
    body: "- Biên lai của bạn từ ",
    time: "11:35",
    isUnread: false,
  },
  {
    id: "ask23444",
    sender: "Hung555@cntt.local",
    subject: " OK jsfjkdfj",
    body: "- Biên lai của bạn từ ",
    time: "11:30",
    isUnread: true,
  },{
    id: "asksgfr",
    sender: "name",
    subject: "Biên lai của bạn ",
    body: "- Biên lai của bạn từ ",
    time: "11:35",
    isUnread: false,
  },
  {
    id: "ask23dxzv",
    sender: "Hung555@cntt.local",
    subject: " OK jsfjkdfj",
    body: "- Biên lai của bạn từ ",
    time: "11:30",
    isUnread: true,
  },{
    id: "asksdf",
    sender: "name",
    subject: "Biên lai của bạn ",
    body: "- Biên lai của bạn từ ",
    time: "11:35",
    isUnread: false,
  },
  {
    id: "ask2hh3",
    sender: "Hung555@cntt.local",
    subject: " OK jsfjkdfj",
    body: "- Biên lai của bạn từ ",
    time: "11:30",
    isUnread: true,
  },{
    id: "asfgfk",
    sender: "name",
    subject: "Biên lai của bạn ",
    body: "- Biên lai của bạn từ ",
    time: "11:35",
    isUnread: false,
  },
  {
    id: "aswrk23",
    sender: "Hung555@cntt.local",
    subject: " OK jsfjkdfj",
    body: "- Biên lai của bạn từ ",
    time: "11:30",
    isUnread: true,
  },{
    id: "aewrsk",
    sender: "name",
    subject: "Biên lai của bạn ",
    body: "- Biên lai của bạn từ ",
    time: "11:35",
    isUnread: false,
  },
  {
    id: "asxcvk23",
    sender: "Hung555@cntt.local",
    subject: " OK jsfjkdfj",
    body: "- Biên lai của bạn từ ",
    time: "11:30",
    isUnread: true,
  },{
    id: "avgjhsk",
    sender: "name",
    subject: "Biên lai của bạn ",
    body: "- Biên lai của bạn từ ",
    time: "11:35",
    isUnread: false,
  },
  {
    id: "ask2dfre3",
    sender: "Hung555@cntt.local",
    subject: " OK jsfjkdfj",
    body: "- Biên lai của bạn từ ",
    time: "11:30",
    isUnread: true,
  },{
    id: "asfdgfbgbk",
    sender: "name",
    subject: "Biên lai của bạn ",
    body: "- Biên lai của bạn từ ",
    time: "11:35",
    isUnread: false,
  },
  {
    id: "abgbghsk23",
    sender: "Hung555@cntt.local",
    subject: " OK jsfjkdfj",
    body: "- Biên lai của bạn từ ",
    time: "11:30",
    isUnread: true,
  },
];
const tag = [
  {
    id: 1,
    name:"mt_5"
  },
  {
    id:2,
    name : "Qwen"
  }
]
export default function Home() {
  const [showCompose, setShowCompose] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);

  return (
    <div className="bg-[#f1f3f4] min-h-screen flex flex-col">
      <Header />
      <main className="flex flex-grow overflow-hidden relative">
      <Sidebar onAddTag = {()=>setShowAddTag(true)} tags = {tag} onNewMail={() => setShowCompose(true)} />
      {/* //Sửa nội dung trong này  */}
      <div className="flex-grow flex flex-col h-full overflow-hidden">
        <EmailList emails={dummyEmails} />
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
          onSave={(newTag) => {}}
          
        />
        </div>
      )}
    </main>
    </div>
  );
}
