import { useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
} from "react-native";
import { useFonts } from "expo-font";
import LogoSpark from "@assets/images/LogoSpark.svg";
import BackButton from "@assets/images/BackButton.svg";
import { useAppFonts } from '@/hooks/useAppFonts';
import CustomAlert from "@components/CustomAlert.jsx";
import { API_URL } from "@./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Code({ route, navigation }) {
    const email = route.params?.email;
    const password = route.params?.password;
    const username = route.params?.username;
    const { fontsLoaded } = useAppFonts();

    const [code, setCode] = useState(["", "", "", "", ""]);
    const inputs = useRef([]);
    const [loading, setLoading] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const showAlert = (message) => {
        setAlertMessage(message);
        setAlertVisible(true);
    };

    if (!fontsLoaded) return null;

    const handleChange = (text, index) => {
        if (!/^\d?$/.test(text)) return;

        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);

        if (text && index < 4) {
            inputs.current[index + 1].focus();
        }
    };

    const handleBackspace = (key, index) => {
        if (key === "Backspace" && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };
    const handleCode = async () =>{
            const codeString = code.join('');
            if (codeString.length !== 5) {
                showAlert("Please enter all 5 digits");
                return;
            }
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/v1/verification/verification?email=${email}&code=${codeString}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    if (data.success){
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
                                try {
                                    const sessionResponse = await fetch(API_URL + "/v1/sessions/", {
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
                                            sessionResponse.headers.get("Authorization")?.replace("Bearer ", "") ||
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
                            } else {
                                if (response.status == 400) {
                                    showAlert(data.detail || "Incorrect registration data");
                                }
                                if (response.status == 422) {
                                    showAlert(data.detail[0].ctx.reason || "Incorrect registration data");
                                }
                            }
                        } catch (error) {
                            showAlert("Server is unavailable");
                        } finally {
                            setLoading(false);
                        }
                    }
                    else{
                    showAlert("Incorrect code")
                }
            }
            }catch(error){
                showAlert("Error sending code")
            }
            finally {
                setLoading(false);
            }
        }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>

                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <BackButton style={styles.backButton}></BackButton>
                </TouchableOpacity>

                <View style={styles.header}>
                    <LogoSpark></LogoSpark>
                </View>

                <Text style={styles.title}>The Final Touch!</Text>
                <Text style={styles.subtitle}>
                    We’ve sent a 5-digit code to your email
                </Text>

                <View style={styles.codeContainer}>
                    {code.map((value, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => (inputs.current[index] = ref)}
                            style={styles.codeInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={value}
                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={({ nativeEvent }) =>
                                handleBackspace(nativeEvent.key, index)
                            }
                            editable={!loading}
                        />
                    ))}
                </View>

                <TouchableOpacity 
                style={styles.button}
                onPress={ handleCode }>
                    <Text style={styles.buttonText}>CONFIRM</Text>
                </TouchableOpacity>
                <CustomAlert
                                        visible={alertVisible}
                                        message={alertMessage}
                                        onClose={() => setAlertVisible(false)}
                                    />
            </View>
        </TouchableWithoutFeedback>
    );
}

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
