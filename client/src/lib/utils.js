export function formatMessageTime(date) {
  if (!date) return ""; // Return empty string if no date
  const dt = new Date(date);
  if (isNaN(dt.getTime())) return ""; // Return empty string if invalid date
  return dt.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
