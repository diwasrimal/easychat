export async function makePayload(res) {
  return { ok: res.ok, status: res.status, ...(await res.json()) };
}

export function getMessagesFromSession(pairId) {
  const stored = sessionStorage.getItem(`messages:${pairId}`);
  if (!stored) return undefined;
  return JSON.parse(stored);
}

export function saveMessagesToSession(pairId, msgs) {
  sessionStorage.setItem(`messages:${pairId}`, JSON.stringify(msgs));
}

export function getLoggedInUserId() {
  const value = localStorage.getItem("loggedInUserId");
  return value ? Number(value) : undefined;
}

export function debounce(func, delay) {
  let timeoutId = 0;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}
