// Helper function to parse event date strings into Date objects
export const parseEventDate = (dateStr: string): Date | null => {
  // Remove day of week if present (e.g., "Saturday, " or "Tuesday, ")
  const cleanedDate = dateStr.replace(/^[A-Za-z]+,?\s*/, "");

  // Parse date strings like "23rd December 2025", "25th October 2025", "27th September"
  const dateMatch = cleanedDate.match(/(\d{1,2})[a-z]{0,2}\s+([A-Za-z]+)\s*(\d{4})?/i);

  if (!dateMatch) return null;

  const day = parseInt(dateMatch[1], 10);
  const monthStr = dateMatch[2];
  const year = dateMatch[3] ? parseInt(dateMatch[3], 10) : new Date().getFullYear();

  const months: Record<string, number> = {
    january: 0, february: 1, march: 2, april: 3,
    may: 4, june: 5, july: 6, august: 7,
    september: 8, october: 9, november: 10, december: 11
  };

  const month = months[monthStr.toLowerCase()];
  if (month === undefined) return null;

  return new Date(year, month, day, 23, 59, 59); // End of the event day
};

// Helper function to check if an event date is in the past
export const isEventPast = (dateStr: string): boolean => {
  const eventDate = parseEventDate(dateStr);
  if (!eventDate) return false;

  const today = new Date();
  return eventDate < today;
};
