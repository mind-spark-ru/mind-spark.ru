import { useEffect, useRef, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import CustomAlert from "@/components/CustomAlert";
import { REACT_URL } from "@./config";
import { API_URL } from "config";
import AsyncStorage from "@react-native-async-storage/async-storage";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin({ navigation }) {
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
        const redirectUri = "mindspark://auth";

        const result = await WebBrowser.openAuthSessionAsync(
          `${REACT_URL}/auth/`,
          redirectUri
        );
        if (result.type !== "success" || !result.url) {
          return;
        }

        const parsed = Linking.parse(result.url);
        const email = parsed?.queryParams?.email;

        if (!email) {
          showAlert("Email не пришёл в редиректе");
          return;
        }

        try{
          const response = await fetch(API_URL + `/v1/sessions/google?email=${email}`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            }
          });
          const data = await response.json();
          if (response.ok) {
                const token =
                    response.headers.get("X-Auth-Token") ||
                    response.headers.get("Authorization")?.replace("Bearer ", "") ||
                    data.token;
                if (token) {
                    await AsyncStorage.setItem("auth_token", token);
                    await AsyncStorage.setItem("user_email", email);
                    navigation.navigate("Profile");
                } else {
                    showAlert("Authorization token not found");
                }
            }
        } catch (e){
          showAlert("WebBrowser error")
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