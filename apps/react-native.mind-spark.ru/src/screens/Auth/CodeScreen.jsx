import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import BackButtonIcon from "@assets/images/BackButton.svg";
import LogoSpark from "@assets/images/LogoSpark.svg";

import CustomAlert from "@components/CustomAlert.jsx";
import Loading from "@components/Loading.jsx";
import { API_URL } from "@./config";
import { useAppFonts } from "@/hooks/useAppFonts";

function CodeScreen({ route, navigation }) {
  const email = route.params?.email;
  const password = route.params?.password;
  const username = route.params?.username;

  const { fontsLoaded } = useAppFonts();

  const inputsRef = useRef([]);
  const [codeDigits, setCodeDigits] = useState(["", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  if (!fontsLoaded) return null;

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertVisible(true);
  };

  const handleDigitChange = (text, index) => {
    if (!/^\d?$/.test(text)) return;

    const nextDigits = [...codeDigits];
    nextDigits[index] = text;
    setCodeDigits(nextDigits);

    if (text && index < 4) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleDigitBackspace = (key, index) => {
    if (key === "Backspace" && !codeDigits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleConfirmCode = async () => {
    const codeString = codeDigits.join("");

    if (codeString.length !== 5) {
      showAlert("Please enter all 5 digits");
      return;
    }

    setIsLoading(true);

    try {
      const verifyResponse = await fetch(
        `${API_URL}/v1/verification/verification?email=${email}&code=${codeString}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const verifyData = await verifyResponse.json();

      if (!verifyResponse.ok) {
        showAlert("Error sending code");
        return;
      }

      if (!verifyData.success) {
        showAlert("Incorrect code");
        return;
      }

      try {
        const registerResponse = await fetch(`${API_URL}/v1/users/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, username, password }),
        });

        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
          if (registerResponse.status === 400) {
            showAlert(registerData.detail || "Incorrect registration data");
          } else if (registerResponse.status === 422) {
            showAlert(
              registerData.detail?.[0]?.ctx?.reason || "Incorrect registration data"
            );
          } else {
            showAlert("Server is unavailable");
          }
          return;
        }

        try {
          const sessionResponse = await fetch(`${API_URL}/v1/sessions/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          const sessionData = await sessionResponse.json();

          if (sessionResponse.ok) {
            const token =
              sessionResponse.headers.get("X-Auth-Token") ||
              sessionResponse.headers
                .get("Authorization")
                ?.replace("Bearer ", "") ||
              sessionData.token;

            if (token) {
              await AsyncStorage.setItem("auth_token", token);
              await AsyncStorage.setItem("user_email", email);
              navigation.navigate("Profile");
            } else {
              showAlert("Authorization token not found");
            }
          } else {
            showAlert(sessionData.detail || "Incorrect login or password");
          }
        } catch (error) {
          showAlert("Server is unavailable");
        }
      } catch (error) {
        showAlert("Server is unavailable");
      }
    } catch (error) {
      showAlert("Error sending code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBackPress = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Loading visible={isLoading} />

        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBackPress}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <BackButtonIcon />
        </TouchableOpacity>

        <View style={styles.header}>
          <LogoSpark />
        </View>

        <Text style={styles.title}>The Final Touch!</Text>
        <Text style={styles.subtitle}>We’ve sent a 5-digit code to your email</Text>

        <View style={styles.codeContainer}>
          {codeDigits.map((value, index) => (
            <TextInput
              key={index}
              ref={(ref) => {
                inputsRef.current[index] = ref;
              }}
              style={styles.codeInput}
              keyboardType="number-pad"
              maxLength={1}
              value={value}
              onChangeText={(text) => handleDigitChange(text, index)}
              onKeyPress={({ nativeEvent }) =>
                handleDigitBackspace(nativeEvent.key, index)
              }
              editable={!isLoading}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleConfirmCode}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>CONFIRM</Text>
        </TouchableOpacity>

        <CustomAlert
          visible={isAlertVisible}
          message={alertMessage}
          onClose={() => setIsAlertVisible(false)}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default CodeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 35,
    left: 15,
    zIndex: 20,
  },
  header: {
    alignItems: "center",
  },
  title: {
    fontFamily: "Montserrat-SemiBold",
    color: "#FBF8EF",
    fontSize: 26,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Montserrat-Regular",
    color: "#7A7A7A",
    textAlign: "center",
    marginBottom: 40,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  codeInput: {
    width: 52,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FBF8EF",
    textAlign: "center",
    fontSize: 24,
    color: "#FBF8EF",
    fontFamily: "Montserrat-SemiBold",
  },
  button: {
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontFamily: "Montserrat-SemiBold",
    color: "#FBF8EF",
    fontSize: 15,
  },
});