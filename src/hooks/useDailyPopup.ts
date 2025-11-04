// useDailyPopup.ts
import { useAuthStore } from "@/store/AuthStore";
import { useEffect } from "react";

export function useDailyPopup(
  onShow: () => void,
  hour = 19,
  minute = 55,
  second = 0,
  storageKey = "popupShownDate"
) {

  const { user } = useAuthStore()
  useEffect(() => {
    let timer: number;

    const msUntilTarget = () => {
      const now = new Date();
      const target = new Date(now);
      target.setHours(hour, minute, second, 0);
      if (target <= now) target.setDate(target.getDate() + 1);
      return target.getTime() - now.getTime();
    };

    

    const schedule = () => {
      timer = window.setTimeout(() => {
        const today = new Date().toDateString();
        const last = localStorage.getItem(storageKey);
        if (last !== today && user?.isActive === true ) {
          localStorage.setItem(storageKey, today);
          onShow();
        }
        schedule(); // schedule the next day
      }, msUntilTarget());
    };

    schedule();
    return () => clearTimeout(timer);
  }, [onShow, hour, minute, second, storageKey]);
}
