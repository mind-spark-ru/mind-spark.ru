import React, { useEffect, useRef, useState } from "react";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import AsyncStorage from "@react-native-async-storage/async-storage";

import CustomAlert from "../../components/CustomAlert";
import Loading from "../../components/Loading";
import { API_URL, REACT_URL } from "../../../config";

WebBrowser.maybeCompleteAuthSession();

function GoogleLoginScreen({ navigation }) {
  const hasOpenedRef = useRef(false);

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertVisible(true);
  };

  useEffect(() => {
    if (hasOpenedRef.current) return;
    hasOpenedRef.current = true;

    const runAuth = async () => {
      setIsLoading(true);

      try {
        const redirectUri = "mindspark://auth";
        const result = await WebBrowser.openAuthSessionAsync(
          `${REACT_URL}/auth/`,
          redirectUri
        );

        if (result.type !== "success" || !result.url) {
          navigation.navigate("Error");
          setIsLoading(false);
          return;
        }

        const parsed = Linking.parse(result.url);
        const email = parsed?.queryParams?.email;

        if (!email) {
          showAlert("Email не пришёл в редиректе");
          setIsLoading(false);
          return;
        }

        try {
          const response = await fetch(
            `${API_URL}/v1/sessions/google?email=${email}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const data = await response.json();

          if (response.ok) {
            const token =
              response.headers.get("X-Auth-Token") ||
              response.headers.get("Authorization")?.replace("Bearer ", "") ||
              data.token;

            if (token) {
              await AsyncStorage.setItem("auth_token", token);
              await AsyncStorage.setItem("user_email", email);
              navigation.navigate("App", { screen: "Profile" });
              return;
            }

            showAlert("Authorization token not found");
          } else {
            showAlert(data.detail || "WebBrowser error");
          }
        } catch (error) {
          showAlert("WebBrowser error");
        } finally {
          setIsLoading(false);
        }
      } catch (error) {
        showAlert("WebBrowser error");
        setIsLoading(false);
      }
    };

    void runAuth();
  }, [navigation]);

  return (
    <>
      <Loading visible={isLoading} />
      <CustomAlert
        visible={isAlertVisible}
        message={alertMessage}
        onClose={() => setIsAlertVisible(false)}
      />
    </>
  );
}

export default GoogleLoginScreen;
