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
import { useFonts } from "expo-font";
import { useState } from "react";
import EyeOpen from "@assets/images/Password/Eye-open.svg";
import EyeClosed from "@assets/images/Password/Eye-close.svg";
import LogoSpark from "@assets/images/LogoSpark.svg";
import BackButton from "@assets/images/BackButton.svg";
import { useAppFonts } from '@/hooks/useAppFonts';

export default function Reg({ navigation }) {
    const { fontsLoaded } = useAppFonts();

    if (!fontsLoaded) return null;

    const [passwordVisible, setPasswordVisible] = useState(false);

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
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="E-mail"
                                placeholderTextColor="#7A7A7A"
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Phone number"
                                placeholderTextColor="#7A7A7A"
                            />
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.passwordInput}
                                    placeholder="Password"
                                    placeholderTextColor="#7A7A7A"
                                    secureTextEntry={!passwordVisible}
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
                                />

                                <TouchableOpacity
                                    onPress={() => setPasswordVisible(!passwordVisible)}
                                >
                                    {passwordVisible ? <EyeOpen style={styles.eyeOpenButton} width={24} height={24} /> : <EyeClosed style={styles.eyeCloseButton} width={24} height={24} />}
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.signUpButton}
                                onPress={() => navigation.navigate("Code")}
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
