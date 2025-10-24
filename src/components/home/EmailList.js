// EmailList.js
"use client";
import EmailItem from "./EmailItem";

export default function EmailList({ emails ,tags}) {
  return (
    <section className="flex-grow h-[calc(100vh-76px)] overflow-y-auto bg-white rounded-r-lg shadow-inner">
      <ul className="divide-y divide-gray-200 text-sm text-gray-900">
        {emails.map((email) => (
          <EmailItem key={email.id} email={email} tagAll = {tags}/>
        ))}
      </ul>
    </section>
  );
}
