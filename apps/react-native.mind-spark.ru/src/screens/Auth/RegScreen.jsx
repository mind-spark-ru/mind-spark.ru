import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import EyeClosedIcon from "@assets/images/Password/Eye-close.svg";
import EyeOpenIcon from "@assets/images/Password/Eye-open.svg";
import BackButtonIcon from "@assets/images/BackButton.svg";
import LogoSpark from "@assets/images/LogoSpark.svg";

import CustomAlert from "@components/CustomAlert.jsx";
import Loading from "@components/Loading.jsx";
import { API_URL } from "@./config";
import { useAppFonts } from "@/hooks/useAppFonts";

function RegScreen({ navigation }) {
  const { fontsLoaded } = useAppFonts();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const encodedEmail = useMemo(() => encodeURIComponent(email), [email]);

  if (!fontsLoaded) return null;

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertVisible(true);
  };

  const handleSendCode = async () => {
    try {
      const response = await fetch(
        `${API_URL}/v1/verification/send_verification_code?email=${encodedEmail}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await response.json();

      if (response.ok) {
        navigation.navigate("Code", {
          email,
          username,
          password,
        });
      } else {
        showAlert("Error sending code");
        setIsLoading(false);
      }
    } catch (error) {
      showAlert("Error sending code");
      setIsLoading(false);
    }
  };

  const handleReg = async () => {
    if (!email || !password || !repeatPassword || !username) {
      showAlert("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      showAlert("An email address must have an @-sign");
      return;
    }

    if (password.length < 8) {
      showAlert("Password must be at least 8 characters long");
      return;
    }

    if (password !== repeatPassword) {
      showAlert("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/v1/users/email/${encodedEmail}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await response.json();

      if (response.ok) {
        showAlert("User with this email already exist");
        setIsLoading(false);
        return;
      }

      if (response.status === 404) {
        await handleSendCode();
      }
    } catch (error) {
      showAlert("Server is unavailable");
      setIsLoading(false);
    }
  };

  const handleGoBackPress = () => {
    navigation.goBack();
  };

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <Loading visible={isLoading} />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
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
                <Text style={styles.title}>Let's Get Started!</Text>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Name"
                placeholderTextColor="#7A7A7A"
                value={username}
                onChangeText={setUsername}
                editable={!isLoading}
              />

              <TextInput
                style={styles.input}
                placeholder="E-mail"
                placeholderTextColor="#7A7A7A"
                value={email}
                onChangeText={setEmail}
                editable={!isLoading}
              />

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#7A7A7A"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                  editable={!isLoading}
                />

                <TouchableOpacity
                  onPress={handleTogglePasswordVisibility}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isPasswordVisible ? (
                    <EyeOpenIcon
                      style={styles.eyeIcon}
                      width={24}
                      height={24}
                    />
                  ) : (
                    <EyeClosedIcon
                      style={styles.eyeIcon}
                      width={24}
                      height={24}
                    />
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Repeat password"
                  placeholderTextColor="#7A7A7A"
                  secureTextEntry={!isPasswordVisible}
                  value={repeatPassword}
                  onChangeText={setRepeatPassword}
                  editable={!isLoading}
                />

                <TouchableOpacity
                  onPress={handleTogglePasswordVisibility}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isPasswordVisible ? (
                    <EyeOpenIcon
                      style={styles.eyeIcon}
                      width={24}
                      height={24}
                    />
                  ) : (
                    <EyeClosedIcon
                      style={styles.eyeIcon}
                      width={24}
                      height={24}
                    />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleReg}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.signUpText}>SIGN UP</Text>
              </TouchableOpacity>

              <StatusBar style="light" />
            </View>
          </TouchableWithoutFeedback>

          <CustomAlert
            visible={isAlertVisible}
            message={alertMessage}
            onClose={() => setIsAlertVisible(false)}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

export default RegScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: -58,
    left: 5,
    zIndex: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontFamily: "Montserrat-SemiBold",
    color: "#FBF8EF",
    fontSize: 26,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#FBF8EF",
    paddingHorizontal: 20,
    color: "#FBF8EF",
    marginBottom: 15,
    fontFamily: "Montserrat-Regular",
  },
  passwordContainer: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#FBF8EF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    color: "#FBF8EF",
    fontFamily: "Montserrat-Regular",
  },
  signUpButton: {
    marginTop: 20,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  signUpText: {
    fontFamily: "Montserrat-SemiBold",
    color: "#FBF8EF",
    fontSize: 15,
  },
  eyeIcon: {
    width: 24,
    height: 24,
  },
});