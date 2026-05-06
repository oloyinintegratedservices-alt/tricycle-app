export function combineDateAndTime(date: Date, time: string) {
  const [hours, minutes, seconds] = time.split(":").map(Number);

  const combined = new Date(date);
  combined.setHours(hours, minutes, seconds || 0, 0);

  return combined;
}
