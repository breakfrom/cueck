export function getNextMinuteTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 1);
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}
