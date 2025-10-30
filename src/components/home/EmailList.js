// EmailList.js
"use client";
import EmailItem from "./EmailItem";

export default function EmailList({ emails ,tags , type, handleScroll}) {
  return (
    <section className="flex-grow h-[calc(100vh-76px)] overflow-y-auto bg-white rounded-r-lg shadow-inner"
      onScroll={(e)=>handleScroll(e)}
    >
      <ul className="divide-y divide-gray-200 text-sm text-gray-900">
        {emails.map((email) => (
          <EmailItem key={email.id} email={email} tagAll = {tags} type = {type}/>
        ))}
      </ul>
    </section>
  );
}
