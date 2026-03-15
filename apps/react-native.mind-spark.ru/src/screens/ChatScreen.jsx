import React, { useEffect, useRef, useState, useCallback } from "react";
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
    ActivityIndicator,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAppFonts } from "../hooks/useAppFonts";

import Magic1 from "../../assets/images/IconsMainScreen/Magic1.svg";
import Square from "../../assets/images/IconsChatScreen/Square.svg";

import BottomNavigation from "../components/BottomNavigation";
import { ML_URL } from "../../config";

// Используем правильный endpoint /predict
const PREDICT_URL = ML_URL + "/v1/ml/predict";
const STORAGE_KEY = "@chat_messages";

export default function ChatScreen() {
    const { fontsLoaded } = useAppFonts();

    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [streamingMessage, setStreamingMessage] = useState("");

    const [isSearchActive, setIsSearchActive] = useState(false);
    const [isDeepActive, setIsDeepActive] = useState(false);

    const scrollViewRef = useRef(null);
    const abortControllerRef = useRef(null);
    const translateY = useRef(new Animated.Value(0)).current;
    const headerOpacity = useRef(new Animated.Value(1)).current;

    // Load messages from AsyncStorage
    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            if (stored) {
                setMessages(JSON.parse(stored));
            } else {
                // Welcome message if no history
                setMessages([
                    {
                        id: "welcome",
                        type: "ai",
                        text: "Hello! I'm MindSpark AI. How can I help you today?",
                        timestamp: Date.now(),
                    },
                ]);
            }
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    const saveMessages = async (newMessages) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
        } catch (error) {
            console.error("Failed to save messages:", error);
        }
    };

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

    // Auto-scroll when messages change or streaming message updates
    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages, streamingMessage]);

    // Cleanup function to abort fetch on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const handleSend = async () => {
        if (!message.trim() || isLoading) return;

        const userMessageText = message.trim();
        setMessage("");

        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            type: "user",
            text: userMessageText,
            timestamp: Date.now(),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        await saveMessages(updatedMessages);

        // Start streaming AI response
        setIsLoading(true);
        setStreamingMessage("");

        // Create abort controller for this request
        abortControllerRef.current = new AbortController();

        try {
            const response = await fetch(`${PREDICT_URL}?text=${encodeURIComponent(userMessageText)}`, {
                method: "POST",
                headers: {
                    "Accept": "text/event-stream",
                },
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }
            
            if (!response.body) {
                throw new Error("Response body is null");
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedMessage = "";
            let buffer = "";

            while (true) {
                const { done, value } = await reader.read();
                
                if (done) {
                    console.log("Stream finished");
                    break;
                }

                // Декодируем чанк
                const chunk = decoder.decode(value, { stream: true });
                console.log("Raw chunk:", chunk);
                
                buffer += chunk;
                
                // Обрабатываем SSE сообщения (разделены \n\n)
                const messages = buffer.split('\n\n');
                buffer = messages.pop() || "";

                for (const msg of messages) {
                    if (!msg.trim()) continue;
                    
                    console.log("Processing message:", msg);
                    
                    // Ищем строки, начинающиеся с "data: "
                    const lines = msg.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            // Берем все после "data: "
                            const token = line.substring(6);
                            
                            // Добавляем токен к сообщению
                            if (token) {
                                accumulatedMessage += token;
                                setStreamingMessage(accumulatedMessage);
                                
                                // Небольшая задержка для плавности
                                await new Promise(resolve => setTimeout(resolve, 10));
                            }
                        }
                    }
                }
            }

            // Сохраняем полное сообщение
            if (accumulatedMessage) {
                const aiMessage = {
                    id: (Date.now() + 1).toString(),
                    type: "ai",
                    text: accumulatedMessage,
                    timestamp: Date.now(),
                };

                const finalMessages = [...updatedMessages, aiMessage];
                setMessages(finalMessages);
                await saveMessages(finalMessages);
            }
            
        } catch (error) {
            console.error("Fetch error:", error);
            
            if (error.name === 'AbortError') {
                console.log('Generation stopped by user');
                
                // Если пользователь остановил генерацию, сохраняем то, что уже накопилось
                if (streamingMessage) {
                    const aiMessage = {
                        id: (Date.now() + 1).toString(),
                        type: "ai",
                        text: streamingMessage + "... (stopped)",
                        timestamp: Date.now(),
                    };
                    const finalMessages = [...updatedMessages, aiMessage];
                    setMessages(finalMessages);
                    await saveMessages(finalMessages);
                }
            } else {
                const errorMessage = {
                    id: (Date.now() + 1).toString(),
                    type: "ai",
                    text: "Sorry, I'm having trouble connecting. Please try again.",
                    timestamp: Date.now(),
                };
                const finalMessages = [...updatedMessages, errorMessage];
                setMessages(finalMessages);
                await saveMessages(finalMessages);
            }
        } finally {
            setIsLoading(false);
            setStreamingMessage("");
            abortControllerRef.current = null;
        }
    };

    const handleStopGeneration = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    const renderMessage = (msg) => {
        if (msg.type === "user") {
            return (
                <View key={msg.id} style={styles.userBubble}>
                    <Text style={styles.userText}>{msg.text}</Text>
                </View>
            );
        } else {
            return (
                <View key={msg.id}>
                    <Text style={styles.aiName}>MindSpark AI</Text>
                    <Text style={styles.aiText}>{msg.text}</Text>
                </View>
            );
        }
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
                            {messages.map(renderMessage)}
                            
                            {isLoading && streamingMessage === "" && (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="small" color="#C7FF10" />
                                    <Text style={styles.loadingText}>MindSpark is thinking...</Text>
                                </View>
                            )}
                            
                            {streamingMessage !== "" && (
                                <View>
                                    <Text style={styles.aiName}>MindSpark AI</Text>
                                    <Text style={styles.aiText}>
                                        {streamingMessage}
                                        <Text style={styles.cursor}>▊</Text>
                                    </Text>
                                </View>
                            )}
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
                                        editable={!isLoading}
                                        multiline
                                    />
                                    <TouchableOpacity 
                                        style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} 
                                        onPress={isLoading ? handleStopGeneration : handleSend}
                                        disabled={!isLoading && !message.trim()}
                                    >
                                        {isLoading ? (
                                            <Ionicons name="stop" size={20} color="#000" />
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
                                        disabled={isLoading}
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
                                        disabled={isLoading}
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
        minHeight: 50,
    },
    input: {
        flex: 1,
        color: "#fff",
        paddingTop: 10,
        paddingBottom: 10,
    },
    sendButton: {
        backgroundColor: "#FBF8EF",
        width: 30,
        height: 30,
        borderRadius: 15,
        justifyContent: "center",
        alignItems: "center",
    },
    sendButtonDisabled: {
        opacity: 0.5,
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
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 16,
        gap: 8,
    },
    loadingText: {
        color: "#7C7C7C",
        fontSize: 14,
    },
    cursor: {
        color: "#C7FF10",
        opacity: 0.7,
    },
});