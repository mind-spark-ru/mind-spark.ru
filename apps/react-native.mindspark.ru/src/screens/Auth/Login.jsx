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
    Alert,
} from "react-native";
import { useFonts } from "expo-font";
import { useState } from "react";
import EyeOpen from "@assets/images/Password/Eye-open.svg";
import EyeClosed from "@assets/images/Password/Eye-close.svg";
import LogoSpark from "@assets/images/LogoSpark.svg";
import BackButton from "@assets/images/BackButton.svg";
import { useAppFonts } from '@/hooks/useAppFonts';
import { API_URL } from "@./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login({ navigation }) {
    const { fontsLoaded } = useAppFonts();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    if (!fontsLoaded) return null;

    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL + "/v1/sessions/", {
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
          navigation.navigate("Profile");
        } else {
          Alert.alert("Error", "Token not found");
        }
      } else {
        Alert.alert("Error", data.detail || "Incorrect login or password");
      }
    } catch (error) {
      Alert.alert("Error", "Serverserver is unavailable");
    } finally {
      setLoading(false);
    }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled">
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View>

                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <BackButton style={styles.backButton}></BackButton>
                            </TouchableOpacity>

                            <View style={styles.header}>
                                <LogoSpark></LogoSpark>
                                <Text style={styles.title}>Welcome Back!</Text>
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="E-mail"
                                placeholderTextColor="#7A7A7A"
                                value={email}
                                onChangeText={setEmail}
                                editable={!loading}
                            />
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Password"
                                    placeholderTextColor="#7A7A7A"
                                    secureTextEntry={!passwordVisible}
                                    value={password}
                                    onChangeText={setPassword}
                                    editable={!loading}
                                />

                                <TouchableOpacity
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? <EyeOpen style={styles.eyeOpenButton} width={24} height={24} /> : <EyeClosed style={styles.eyeCloseButton} width={24} height={24} />}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity 
                            style={styles.loginButton}
                            onPress={handleLogin}
                            >
                                <Text style={styles.loginText}>LOG IN</Text>
                            </TouchableOpacity>

                            <StatusBar style="light" />
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#141414",
        justifyContent: "center",
    },
    scrollContent: {
        flexGrow: 1,
        padding: 20,
        justifyContent: 'center',
    },
    backButton: {
        position: "absolute",
        top: -100,
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
    eyeCloseButton: {
        marginTop: 10,
        paddingLeft: 10,
    },
    eyeOpenButton: {
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
