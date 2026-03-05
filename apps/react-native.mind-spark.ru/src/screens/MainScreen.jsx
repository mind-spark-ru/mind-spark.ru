import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Logotype from "../../assets/images/Logotype.js";
import Loading from "../components/Loading.jsx";
import { useAppFonts } from "../hooks/useAppFonts";

function MainScreen({ navigation }) {
  const { fontsLoaded } = useAppFonts();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);

      try {
        const token = await AsyncStorage.getItem("auth_token");
        if (token) {
          navigation.navigate("App", { screen: "Profile" });
          return;
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    void checkAuth();
  }, [navigation]);

  if (!fontsLoaded) return null;

  return (
    <ImageBackground
      source={require("../../assets/images/Main_screen.png")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Loading visible={isLoading} />

        <View style={styles.logoContainer}>
          <Logotype />
          <Text style={styles.tagline}>INTELLIGENCE IN EVERY STEP</Text>
        </View>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate("Reg")}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.signUpText}>SIGN UP</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => navigation.navigate("Soon")}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/images/browsers/Yandex.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Continue with Yandex</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => navigation.navigate("GoogleLogin")}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Image
            source={require("../../assets/images/browsers/Google.png")}
            style={styles.socialIcon}
          />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate("Login")}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <Text style={styles.loginText}>LOG IN</Text>
        </TouchableOpacity>

        <StatusBar style="light" />
      </View>
    </ImageBackground>
  );
}

export default MainScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 330,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  tagline: {
    fontFamily: "Montserrat-Regular",
    color: "#FBF8EF",
    fontSize: 10,
    marginTop: 3,
    textAlign: "center",
    letterSpacing: 2,
  },
  signUpButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    backgroundColor: "#C7FF10",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  signUpText: {
    fontFamily: "Montserrat-SemiBold",
    color: "#141414",
    fontWeight: "600",
    fontSize: 15,
  },
  socialButton: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#FBF8EF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialText: {
    fontFamily: "Montserrat-SemiBold",
    color: "#FBF8EF",
    fontSize: 15,
  },
  loginLink: {
    marginTop: 15,
  },
  loginText: {
    fontFamily: "Montserrat-Medium",
    color: "#FBF8EF",
    fontSize: 15,
  },
});
