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

export default function Reg({ navigation }) {
    const { fontsLoaded } = useAppFonts();
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeat_password, setRepeat_Password] = useState("");
    const [loading, setLoading] = useState(false);

    if (!fontsLoaded) return null;

    const [passwordVisible, setPasswordVisible] = useState(false);

    const handleReg = async () => {
    if (!email || !password || !repeat_password || !username) {
      Alert.alert("Error", "Fill in all fields");
      return;
    }

    if (password != repeat_password) {
      Alert.alert("Error", "Password's fields are different");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(API_URL + "/v1/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate("Code")
      } else {
        if (response.status == 400){
          Alert.alert("Error", data.detail || "Incorrect registration data");
        }
        if (response.status == 422){
          Alert.alert("Error", data.detail[0].ctx.reason || "Incorrect registration data");
        }
      }
    } catch (error) {
        Alert.alert("Error", "Server is unavailable");
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
                                <Text style={styles.title}>Let’s Get Started!</Text>
                            </View>

                            <TextInput
                                style={styles.input}
                                placeholder="Name"
                                placeholderTextColor="#7A7A7A"
                                value={username}
                                onChangeText={setUserName}
                                editable={!loading}
                            />
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
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Repeat password"
                                    placeholderTextColor="#7A7A7A"
                                    secureTextEntry={!passwordVisible}
                                    value={repeat_password}
                                    onChangeText={setRepeat_Password}
                                    editable={!loading}
                                />

                                <TouchableOpacity
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? <EyeOpen style={styles.eyeOpenButton} width={24} height={24} /> : <EyeClosed style={styles.eyeCloseButton} width={24} height={24} />}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.signUpButton}
                                onPress={ handleReg }
                            >
                                <Text style={styles.signUpText}>SIGN UP</Text>
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
        top: -44,
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
        marginHorizontal: 0,
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
});
