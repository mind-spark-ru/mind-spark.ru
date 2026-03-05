import React, { useEffect, useRef, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Platform,
    Keyboard,
    Animated,
    Easing,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppFonts } from "../hooks/useAppFonts";

import Magic1 from "../../assets/images/IconsMainScreen/Magic1.svg";
import Square from "../../assets/images/IconsChatScreen/Square.svg";

import BottomNavigation from "../components/BottomNavigation";


export default function ChatScreen() {
    const { fontsLoaded } = useAppFonts();

    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isDeepActive, setIsDeepActive] = useState(false);

    const [message, setMessage] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    const scrollViewRef = useRef(null);
    const translateY = useRef(new Animated.Value(0)).current;
    const headerOpacity = useRef(new Animated.Value(1)).current;

    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

        const keyboardShow = Keyboard.addListener(showEvent, (event) => {
            const height = event.endCoordinates.height;
            setKeyboardHeight(height);

            Animated.timing(headerOpacity, {
                toValue: 0,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();

            Animated.timing(translateY, {
                toValue: -height + 100,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            });
        });

        const keyboardHide = Keyboard.addListener(hideEvent, () => {
            setKeyboardHeight(0);

            Animated.timing(headerOpacity, {
                toValue: 1,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();

            Animated.timing(translateY, {
                toValue: 0,
                duration: 250,
                easing: Easing.out(Easing.ease),
                useNativeDriver: true,
            }).start();
        });

        return () => {
            keyboardShow.remove();
            keyboardHide.remove();
        };
    }, [translateY, headerOpacity]);

    const handleSend = () => {
        setIsSending((prev) => !prev);

        if (!message.trim()) return;

        console.log("Send:", message);
        setMessage("");
        scrollViewRef.current?.scrollToEnd({ animated: true });
    };


    if (!fontsLoaded) return null;

    return (
        <LinearGradient
            colors={["#1A2B00", "#0E0E0E", "#000000"]}
            locations={[0, 0.4, 1]}
            style={{ flex: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
                <View style={{ flex: 1 }}>

                    <Animated.View
                        style={[
                            styles.headerRow,
                            { opacity: headerOpacity },
                        ]}
                    >
                        <Text style={styles.header}>MindSpark AI</Text>
                        <Magic1 width={20} height={20} style={styles.spark} />
                    </Animated.View>

                    <Animated.View
                        style={[
                            styles.contentWrapper,
                            { transform: [{ translateY }] },
                        ]}
                    >
                        <ScrollView
                            ref={scrollViewRef}
                            style={{ flex: 1 }}
                            contentContainerStyle={{
                                paddingHorizontal: 20,
                                paddingBottom: 20,
                            }}
                            showsVerticalScrollIndicator={false}
                            keyboardShouldPersistTaps="handled"
                        >
                            <View style={styles.userBubble}>
                                <Text style={styles.userText}>
                                    Hi, Sparky. How was my sleep today? I feel like I was tossing and turning half the night again.
                                </Text>
                            </View>

                            <Text style={styles.aiName}>MindSpark AI</Text>
                            <Text style={styles.aiText}>
                                Good morning! Analyzing your data from the last 24 hours.
                            </Text>

                            <Text style={styles.aiText}>
                                {"\n"}Yes, your sleep was rather light:
                                {"\n"}
                                {"\n"}- deep sleep phases made up only 12% of total time instead of the usual 20–25%;
                                {"\n"}- your nighttime heart rate was 10% higher than average.
                                {"\n"}
                                {"\n"}What happened last night? I see you put your phone down at 11:40 PM but fell asleep closer to 1 AM.
                            </Text>

                            <View style={styles.userBubble}>
                                <Text style={styles.userText}>
                                    Seriously, it's that obvious? I just got stuck scrolling on my phone.
                                </Text>
                            </View>

                            <Text style={styles.aiName}>MindSpark AI</Text>
                            <Text style={styles.aiText}>
                                That explains the data. Blue light suppresses melatonin production, and stressful content raises cortisol levels. The result is "false alertness" in the middle of the night.
                                {"\n"}
                                {"\n"}Would you like me to remind you at 10:30 PM today to put your devices away and read a paper book instead?
                            </Text>

                            <View style={styles.userBubble}>
                                <Text style={styles.userText}>
                                    Yeah, let's do that. By the way, why do I feel so exhausted in the morning? I did sleep around 6 hours.
                                </Text>
                            </View>

                            <Text style={styles.aiName}>MindSpark AI</Text>
                            <Text style={styles.aiText}>
                                It's not just about quantity — quality matters too.
                                {"\n"}
                                {"\n"}You woke up at least 4 times (micro-awakenings were detected), even if you don't remember them. That interrupted your sleep cycles. I recommend going to bed earlier tonight — around 10:00 PM.
                                {"\n"}
                                {"\n"}By the way, you have a workout scheduled in an hour. Considering the lack of sleep, it would be better to replace strength training with light stretching or a walk to avoid overloading your heart.
                                {"\n"}
                                {"\n"}What do you think?
                            </Text>

                            <View style={styles.userBubble}>
                                <Text style={styles.userText}>
                                    Oh, I didn't even think about that. My head does feel heavy. Probably not the best idea to lift weights today. I'll keep that in mind.
                                </Text>
                            </View>

                            <Text style={styles.aiName}>MindSpark AI</Text>
                            <Text style={styles.aiText}>
                                Great. I've updated your plan: today's recommendation is yoga stretching or low-intensity cardio for 40 minutes.
                                {"\n"}
                                {"\n"}Keep your hydration levels under control — your body dehydrates more than usual overnight. Drink a glass of water right now if you haven't already.
                            </Text>

                            <View style={styles.userBubble}>
                                <Text style={styles.userText}>
                                    Already drinking. Thanks, Sparky. You're like a caring doctor.
                                </Text>
                            </View>

                            <Text style={styles.aiName}>MindSpark AI</Text>
                            <Text style={styles.aiText}>
                                Always here to keep your body and mind in balance. Have a wonderful day!
                            </Text>
                        </ScrollView>

                        <View style={styles.inputContainer}>
                            <View style={styles.chatBottomPanel}>
                                <View style={styles.inputWrapper}>
                                    <TextInput
                                        value={message}
                                        onChangeText={setMessage}
                                        placeholder="How can I help you?"
                                        placeholderTextColor="#888"
                                        style={styles.input}
                                    />
                                    <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                                        {isSending ? (
                                            <Square width={16} height={16} />
                                        ) : (
                                            <Ionicons name="arrow-forward" size={20} color="#000" />
                                        )}
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.actionsRow}>
                                    <TouchableOpacity
                                        style={[
                                            styles.actionButton,
                                            isSearchActive && styles.actionButtonActive,
                                        ]}
                                        onPress={() => setIsSearchActive(prev => !prev)}
                                    >
                                        <Ionicons
                                            name="globe-outline"
                                            size={18}
                                            color={isSearchActive ? "#C7FF10" : "#AAA"}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[
                                            styles.actionButton,
                                            styles.deepButton,
                                            isDeepActive && styles.actionButtonActive,
                                        ]}
                                        onPress={() => setIsDeepActive(prev => !prev)}
                                    >
                                        <Ionicons
                                            name="bulb-outline"
                                            size={18}
                                            color={isDeepActive ? "#C7FF10" : "#AAA"}
                                        />
                                        <Text
                                            style={[
                                                styles.deepText,
                                                isDeepActive && styles.deepTextActive,
                                            ]}
                                        >
                                            Deep analysis
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Animated.View>

                    <BottomNavigation style={{ position: "absolute", bottom: 0 }} />
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    contentWrapper: {
        flex: 1,
        position: "relative",
    },
    headerRow: {
        paddingHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 5,
        backgroundColor: "transparent",
    },
    header: {
        fontFamily: "Montserrat-SemiBold",
        fontSize: 20,
        color: "#FBF8EF",
        marginTop: 10,
        marginBottom: 20,
    },
    spark: {
        marginLeft: 3,
        marginTop: 10,
        marginBottom: 20,
    },
    aiName: {
        color: "#7C7C7C",
        fontStyle: "italic",
        marginTop: 16,
        marginBottom: 6,
    },
    aiText: {
        color: "#EAEAEA",
        fontSize: 15,
        lineHeight: 25,
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: "#C7FF10",
        padding: 14,
        marginVertical: 10,
        maxWidth: "80%",
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 0,
    },
    userText: {
        fontFamily: "Montserrat-SemiBold",
        color: "#000",
        fontSize: 14,
        lineHeight: 20,
    },
    chatBottomPanel: {
        paddingTop: 15,
        paddingBottom: 30,
        paddingHorizontal: 0,
        backgroundColor: "transparent",
    },
    inputContainer: {
        borderRadius: 30,
        backgroundColor: "#2a2a2a",
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    inputWrapper: {
        flexDirection: "row",
        backgroundColor: "#3A3A3A",
        borderRadius: 30,
        alignItems: "center",
        paddingHorizontal: 15,
        height: 50,
    },
    input: {
        flex: 1,
        color: "#fff",
    },
    sendButton: {
        backgroundColor: "#FBF8EF",
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    actionsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        gap: 12,
    },
    actionButton: {
        height: 36,
        paddingHorizontal: 16,
        borderRadius: 50,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        backgroundColor: "#2A2A2A",
        borderColor: "#3A3A3A",
    },
    actionButtonActive: {
        borderColor: "#C7FF10",
    },
    deepButton: {
        width: 130,
    },
    deepText: {
        color: "#AAA",
        fontSize: 12,
        marginLeft: 3,
    },
    deepTextActive: {
        color: "#C7FF10",
    },
});