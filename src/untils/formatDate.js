// utils/formatDate.js
export const formatDate = (isoString) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = date.toLocaleString("vi-VN", { month: "short" });
  const year = date.getFullYear();
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${day} ${month} ${year}, ${hour}:${minute}`;
};
