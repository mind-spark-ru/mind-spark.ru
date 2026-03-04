import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

import Loading from "@/components/Loading";
import { useAppFonts } from "@/hooks/useAppFonts";

import Avatar from "@assets/images/IconsMainScreen/Avatar.svg";
import Watch from "@assets/images/IconsMainScreen/Watch.svg";

import ActivityCircle from "@assets/images/IconsMainScreen/Circles/ActivityCircle.svg";
import SparkCircle from "@assets/images/IconsMainScreen/Circles/SparkCircle.svg";
import StressCircle from "@assets/images/IconsMainScreen/Circles/StressCircle.svg";

import Diary from "@assets/images/IconsMainScreen/Diary.svg";
import Magic1 from "@assets/images/IconsMainScreen/Magic1.svg";
import Minus from "@assets/images/IconsMainScreen/Minus.svg";
import Plus from "@assets/images/IconsMainScreen/Plus.svg";

import Calories from "@assets/images/IconsMainScreen/Trackers/Calories.svg";
import PlusMini from "@assets/images/IconsMainScreen/Trackers/PlusMini.svg";
import Pulse from "@assets/images/IconsMainScreen/Trackers/Pulse.svg";
import Sleep from "@assets/images/IconsMainScreen/Trackers/Sleep.svg";
import Steps from "@assets/images/IconsMainScreen/Trackers/Steps.svg";
import Water from "@assets/images/IconsMainScreen/Trackers/Water.svg";

function ProfileScreen({ navigation }) {
  const { fontsLoaded } = useAppFonts();

  const [note, setNote] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const [activeTab, setActiveTab] = useState(0);
  const anim = useRef(new Animated.Value(0)).current;
  const indicatorOpacity = useRef(new Animated.Value(1)).current;

  const scrollRef = useRef(null);

  useEffect(() => {
    const isStarTab = activeTab === 2;

    Animated.spring(anim, {
      toValue: activeTab * 78.7,
      useNativeDriver: true,
      stiffness: 120,
      damping: 18,
    }).start();

    Animated.timing(indicatorOpacity, {
      toValue: isStarTab ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [activeTab, anim, indicatorOpacity]);

  if (!fontsLoaded) return null;

  const activitiesData = [
    {
      icon: "walk",
      label: "STEPS",
      value: "8,193",
      goal: "/10k",
      svg: Steps,
      unit: PlusMini,
    },
    {
      icon: "moon",
      label: "SLEEP",
      value: "9.2",
      goal: "hours",
      svg: Sleep,
      unit: PlusMini,
    },
    {
      icon: "flame",
      label: "CALORIES",
      value: "1,207",
      goal: "/2,186 kcal",
      svg: Calories,
      unit: PlusMini,
    },
    {
      icon: "water",
      label: "WATER",
      value: "5",
      goal: "/8 glasses",
      svg: Water,
      unit: PlusMini,
    },
    {
      icon: "heart",
      label: "PULSE",
      value: "72",
      goal: "/min",
      svg: Pulse,
      unit: PlusMini,
    },
  ];

  const MetricCircle = ({
    svgComponent: SvgComponent,
    value,
    label,
    circleSize = 100,
    valueFontSize = 20,
    isLarge = false,
  }) => {
    return (
      <View style={styles.ringItem}>
        <View
          style={[
            styles.circleContainer,
            { width: circleSize, height: circleSize },
          ]}
        >
          <SvgComponent width={circleSize} height={circleSize} />
          <View style={styles.circleContent}>
            <Text
              style={[
                styles.circleValue,
                { fontSize: isLarge ? 32 : valueFontSize },
              ]}
            >
              {value}
            </Text>
          </View>
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={["#1A2B00", "#0E0E0E", "#141414"]}
      locations={[0, 0.4, 1]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={0}
      >
        <SafeAreaView style={styles.container}>
          <Loading visible={false} />

          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.headerContainer}>
              <View style={styles.topRow}>
                <View style={styles.leftColumn}>
                  <TouchableOpacity style={styles.avatarButton} activeOpacity={0.8}>
                    <Avatar width={28} height={28} />
                  </TouchableOpacity>
                </View>

                <View style={styles.centerColumn}>
                  <TouchableOpacity style={styles.todayButton} activeOpacity={0.8}>
                    <Text style={styles.todayText}>TODAY</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.rightColumn}>
                  <View style={styles.batteryContainer}>
                    <Text style={styles.batteryText}>89%</Text>
                    <Watch width={28} height={28} />
                  </View>
                </View>
              </View>

              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>Good Morning, Anna!</Text>
                <Text style={styles.subheader}>
                  Take a look at your current trackers
                </Text>
              </View>

              <View style={styles.sparkContainer}>
                <View style={styles.ringInner}>
                  <MetricCircle
                    svgComponent={StressCircle}
                    value="25%"
                    label="STRESS"
                    circleSize={100}
                    valueFontSize={20}
                  />
                  <MetricCircle
                    svgComponent={SparkCircle}
                    value="75"
                    label="SPARK"
                    circleSize={140}
                    valueFontSize={36}
                    isLarge
                  />
                  <MetricCircle
                    svgComponent={ActivityCircle}
                    value="46%"
                    label="ACTIVITY"
                    circleSize={100}
                    valueFontSize={20}
                  />
                </View>
              </View>
            </View>

            <View style={styles.adviceCard}>
              <View style={styles.adviceBox}>
                <Text style={styles.adviceTitle}>Advice of the day</Text>
                <View style={styles.iconWrapper}>
                  <Magic1 width={20} height={20} />
                </View>
              </View>

              <Text style={styles.adviceText}>
                Is stress at its peak? Choose a quiet place for a break at 3 p.m.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's activities</Text>

              {activitiesData.map((item, i) => (
                <View key={i} style={styles.activityItem}>
                  <View style={styles.iconBox}>
                    <item.svg width={35} height={35} />
                  </View>

                  <View style={styles.activityInfo}>
                    <Text style={styles.activityLabel}>{item.label}</Text>
                    <View style={styles.valueContainer}>
                      <Text style={styles.activityValue}>{item.value}</Text>
                      <Text style={styles.activityGoal}>{item.goal}</Text>
                    </View>
                  </View>

                  <TouchableOpacity style={styles.plusBtn} activeOpacity={0.8}>
                    <item.unit width={25} height={25} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Measurements</Text>
                <TouchableOpacity activeOpacity={0.8}>
                  <Text style={styles.moreLink}>More</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.measurementCard}>
                <Text style={styles.measureLabel}>WEIGHT</Text>
                <Text style={styles.measureGoal}>Goal: 57.0 kg</Text>

                <View style={styles.weightRow}>
                  <TouchableOpacity activeOpacity={0.8}>
                    <Minus />
                  </TouchableOpacity>
                  <Text style={styles.weightValue}>53.4 kg</Text>
                  <TouchableOpacity activeOpacity={0.8}>
                    <Plus />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Activities</Text>
                <TouchableOpacity activeOpacity={0.8}>
                  <Text style={styles.moreLink}>More</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.activitySummary}>
                <Text style={styles.stepsValue}>8,193 steps</Text>
                <Text style={styles.stepsDetail}>6 km, 356 kcal</Text>

                <View style={styles.progressContainer}>
                  <View style={styles.progressBarBackground}>
                    <View style={[styles.progressBarFill, { width: "70%" }]} />
                  </View>
                </View>
              </View>

              <TouchableOpacity style={styles.addActivityBtn} activeOpacity={0.8}>
                <Plus width={30} height={30} />
              </TouchableOpacity>
            </View>

            <View style={styles.diarySection}>
              <View style={styles.diaryHeader}>
                <View style={styles.diaryBox}>
                  <Text style={styles.diaryTitle}>MindSpark Diary</Text>
                  <View style={styles.iconWrapper}>
                    <Diary width={20} height={20} />
                  </View>
                </View>

                <Text style={styles.diarySubtitle}>
                  Write down and analyze your thoughts and observations together with
                  MindSpark AI!
                </Text>
              </View>

              <TouchableOpacity style={styles.monthButtonWrapper} activeOpacity={0.8}>
                <View style={styles.monthButton}>
                  <Text style={styles.month}>FEBRUARY</Text>
                </View>
              </TouchableOpacity>

              <View style={styles.calendar}>
                <View style={styles.daysRow}>
                  {[8, 9, 10, 11, 12].map((day) => (
                    <TouchableOpacity
                      key={day}
                      style={[styles.dayBtn, day === 10 && styles.selectedDay]}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          day === 10 && styles.selectedDayText,
                        ]}
                      >
                        {day}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.noteInput}>
                <TextInput
                  placeholder="Add note"
                  placeholderTextColor="#888"
                  multiline
                  numberOfLines={3}
                  style={styles.noteInputText}
                  value={note}
                  onChangeText={setNote}
                  onFocus={() => {
                    setIsFocused(true);
                    setTimeout(() => {
                      scrollRef.current?.scrollToEnd({ animated: true });
                    }, 300);
                  }}
                  onBlur={() => setIsFocused(false)}
                />
                {isFocused && (
                  <TouchableOpacity
                    style={[
                      styles.sendButton,
                      { backgroundColor: note.trim() ? "#C7FF10" : "rgba(255,255,255,0.2)" }
                    ]}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.sendText,
                        { color: note.trim() ? "#000" : "#999" }
                      ]}
                    >
                      Send
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#141414",
  },
  container: {
    flex: 1,
  },
  content: {
    paddingBottom: 80,
  },
  headerContainer: {
    paddingBottom: 20,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  avatarButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  leftColumn: {
    flex: 1,
    alignItems: "flex-start",
  },
  centerColumn: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  rightColumn: {
    flex: 1,
    alignItems: "flex-end",
  },
  todayButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FBF8EF",
    borderRadius: 25,
    paddingHorizontal: 28,
    paddingVertical: 10,
  },
  todayText: {
    fontFamily: "Montserrat-SemiBold",
    color: "#FBF8EF",
    fontSize: 12,
    fontWeight: "600",
  },
  batteryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  batteryText: {
    fontFamily: "Montserrat-Regular",
    color: "#FBF8EF",
    fontSize: 14,
    fontWeight: "500",
  },
  greetingContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  greeting: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 24,
    fontWeight: "700",
    color: "#FBF8EF",
    textAlign: "center",
    marginBottom: 6,
    maxWidth: 300,
  },
  subheader: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "rgba(251, 248, 239, 0.6)",
    textAlign: "center",
  },
  sparkContainer: {
    paddingHorizontal: 20,
    paddingVertical: 25,
  },
  ringInner: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
  },
  ringItem: {
    alignItems: "center",
  },
  circleContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  circleContent: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  circleValue: {
    fontFamily: "Montserrat-SemiBold",
    fontWeight: "800",
    color: "#FBF8EF",
    textAlign: "center",
  },
  label: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: "Montserrat-SemiBold",
    fontWeight: "600",
    color: "#FBF8EF",
    letterSpacing: 0.5,
  },
  iconWrapper: {
    marginLeft: 6,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  adviceBox: {
    flexDirection: "row",
    position: "relative",
    alignItems: "stretch",
  },
  adviceCard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginHorizontal: 20,
    marginTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  adviceTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    fontWeight: "700",
    color: "#FBF8EF",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  adviceText: {
    flexWrap: "wrap",
    width: "100%",
    fontFamily: "Montserrat-Italic",
    fontSize: 14,
    color: "#B0B0B0",
    paddingRight: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 15,
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    fontWeight: "700",
    color: "#FBF8EF",
    marginBottom: 15,
  },
  moreLink: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#C7FF10",
    fontWeight: "600",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FBF8EF",
  },
  iconBox: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activityInfo: {
    flex: 1,
  },
  activityLabel: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "rgba(251, 248, 239, 0.6)",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  activityValue: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 18,
    fontWeight: "700",
    color: "#C7FF10",
  },
  activityGoal: {
    fontFamily: "Montserrat-Regular",
    fontSize: 14,
    color: "rgba(251, 248, 239, 0.6)",
    marginLeft: 4,
  },
  plusBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  measurementCard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 20,
    padding: 40,
  },
  measureLabel: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 16,
    color: "#FBF8EF",
    textAlign: "center",
  },
  measureGoal: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "rgba(251, 248, 239, 0.6)",
    textAlign: "center",
    marginTop: 5,
  },
  weightRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  weightValue: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 24,
    fontWeight: "700",
    color: "#FBF8EF",
    marginHorizontal: 12,
  },
  activitySummary: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 40,
  },
  stepsValue: {
    fontFamily: "Montserrat-Semibold",
    fontSize: 20,
    fontWeight: "700",
    color: "#FBF8EF",
    textAlign: "center",
  },
  stepsDetail: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "rgba(251, 248, 239, 0.6)",
    textAlign: "center",
    marginTop: 4,
  },
  progressContainer: {
    width: "100%",
    paddingHorizontal: 4,
    marginTop: 20,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 6,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#C7FF10",
    borderRadius: 6,
  },
  addActivityBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    width: 80,
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  diarySection: {
    marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  diaryHeader: {
    marginBottom: 16,
  },
  diaryBox: {
    flexDirection: "row",
    position: "relative",
    alignItems: "center",
  },
  diaryTitle: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 20,
    fontWeight: "700",
    color: "#FBF8EF",
    marginBottom: 4,
    marginRight: 0,
  },
  diarySubtitle: {
    marginTop: 5,
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#B0B0B0",
    paddingRight: 1,
  },
  calendar: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 16,
  },
  monthButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  monthButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#FBF8EF",
    borderRadius: 25,
    padding: 10,
    marginBottom: 10,
  },
  month: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 10,
    fontWeight: "600",
    color: "#FBF8EF",
    textAlign: "center",
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  dayBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  selectedDay: {
    backgroundColor: "#C7FF10",
  },
  dayText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 14,
    color: "#FBF8EF",
    textAlign: "center",
  },
  selectedDayText: {
    color: "#000",
    fontWeight: "700",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginTop: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 16,
    padding: 14,
    position: "relative",
  },
  noteInputText: {
    fontFamily: "Montserrat-Regular",
    fontSize: 12,
    color: "#FBF8EF",
    minHeight: 80,
  },
  sendButton: {
    position: "absolute",
    right: 12,
    bottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendText: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: 12,
  },
});