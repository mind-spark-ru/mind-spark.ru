
import { useEffect, useRef, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import CustomAlert from "@/components/CustomAlert";

export default function GoogleLogin() {
  const openedRef = useRef(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const showAlert = (message) => {
        setAlertMessage(message);
        setAlertVisible(true);
    };

  useEffect(() => {
    if (openedRef.current) return;
    openedRef.current = true;

    (async () => {
      try {
        await WebBrowser.openBrowserAsync("http://localhost:3000/auth/");
      } catch (e) {
        showAlert("WebBrowser error:", e)
      }
    })();
  }, []);

  return (
    <>
      <CustomAlert
          visible={alertVisible}
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
      />
    </>
  );
}