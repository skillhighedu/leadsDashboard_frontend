import { useEffect, useState } from "react";

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState<boolean>(true); // Start with optimistic value

  const checkInternetConnection = async () => {
    try {
      await fetch("https://www.google.com/generate_204", {
        method: "GET",
        mode: "no-cors",
      });
      setIsOnline(true);
    } catch (error) {
        console.log(error)
      setIsOnline(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => checkInternetConnection();
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    checkInternetConnection();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};

export default useNetworkStatus;
