export const generateGuestId = (): string => {
  return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const getStoredGuestId = (): string => {
  if (typeof window === "undefined") return "";

  let storedGuestId = localStorage.getItem("shadowSignal_guestId");
  if (!storedGuestId) {
    storedGuestId = generateGuestId();
    localStorage.setItem("shadowSignal_guestId", storedGuestId);
  }
  return storedGuestId;
};

export const getStoredUsername = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("shadowSignal_username");
};

export const setStoredUsername = (username: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("shadowSignal_username", username);
};
