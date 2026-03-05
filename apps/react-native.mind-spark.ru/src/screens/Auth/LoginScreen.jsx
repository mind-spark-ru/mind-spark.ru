import React, { useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import EyeClosedIcon from "../../../assets/images/Password/Eye-close.svg";
import EyeOpenIcon from "../../../assets/images/Password/Eye-open.svg";
import BackButtonIcon from "../../../assets/images/BackButton.svg";
import LogoSpark from "../../../assets/images/LogoSpark.svg";

import CustomAlert from "../../components/CustomAlert.jsx";
import Loading from "../../components/Loading.jsx";
import { API_URL } from "../../../config";
import { useAppFonts } from "../../hooks/useAppFonts";

function LoginScreen({ navigation }) {
  const { fontsLoaded } = useAppFonts();

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  if (!fontsLoaded) return null;

  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert("Please fill in all fields");
      return;
    }

    if (!email.includes("@")) {
      showAlert("An email address must have an @-sign");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/v1/sessions/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
          navigation.navigate("App", { screen: "Profile" });
        } else {
          showAlert("Authorization token not found");
        }
      } else {
        showAlert(data.detail || "Incorrect login or password");
      }
    } catch (error) {
      showAlert("Server is unavailable. Please try again later");
    } finally {
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

      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBackPress}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <BackButtonIcon />
      </TouchableOpacity>

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

              <View style={styles.header}>
                <LogoSpark />
                <Text style={styles.title}>Welcome Back!</Text>
              </View>

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
                    <EyeOpenIcon style={styles.eyeIcon} width={24} height={24} />
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
                style={styles.loginButton}
                onPress={handleLogin}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <Text style={styles.loginText}>LOG IN</Text>
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

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
    justifyContent: "center",
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
    top: 60,
    left: 20,
    zIndex: 100,
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
  eyeIcon: {
    marginTop: 10,
    paddingLeft: 10,
  },
  loginButton: {
    marginTop: 20,
    alignItems: "center",
  },
  loginText: {
    fontFamily: "Montserrat-SemiBold",
    color: "#FBF8EF",
    fontSize: 15,
  },
});
