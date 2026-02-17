import { useEffect, useRef, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import CustomAlert from "@/components/CustomAlert";

WebBrowser.maybeCompleteAuthSession();

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
        const redirectUri = AuthSession.makeRedirectUri({
          scheme: "mindspark",
        });

        const result = await WebBrowser.openAuthSessionAsync(
          "http://localhost:3000/auth/",
          redirectUri
        );

        if (result.type === "success") {
          console.log("Returned URL:", result.url);

          const parsed = AuthSession.parse(result.url);
          const email = parsed.queryParams?.email;

          console.log("User email:", email);
        }
      } catch (e) {
        showAlert("WebBrowser error");
      }
    })();
  }, []);

  return (
    <CustomAlert
      visible={alertVisible}
      message={alertMessage}
      onClose={() => setAlertVisible(false)}
    />
  );
}