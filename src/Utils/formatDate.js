export const formatDate = dateString => {
  if (!dateString) return ""; // 🔥 Ensure UTC parsing

  const date = new Date(dateString);
  const now = new Date(); // 🔥 Force both to IST for consistency

  const IST_OFFSET = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(date.getTime() + IST_OFFSET);
  const istNow = new Date(now.getTime() + IST_OFFSET);
  const seconds = Math.floor((istNow - istDate) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24); // 🟢 JUST NOW

  if (seconds < 60) return "Just now"; // 🟢 MINUTES

  if (minutes < 60) return `${minutes} min ago`; // 🟢 HOURS

  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`; // 🟢 YESTERDAY

  if (days === 1) return "Yesterday"; // 🟢 DAYS

  if (days < 7) return `${days} days ago`; // 🟢 INDIAN DATE FORMAT

  return istDate.toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
};