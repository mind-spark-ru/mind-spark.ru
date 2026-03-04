import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";

import Pen from "@assets/images/IconsSettingsScreen/Pencil.svg";
import ProfileIcon from "@assets/images/IconsSettingsScreen/ProfileIcon.svg";
import Goal from "@assets/images/IconsSettingsScreen/Goal.svg";
import Premium from "@assets/images/IconsSettingsScreen/Premium.svg";
import Privacy from "@assets/images/IconsSettingsScreen/Privacy.svg";
import Bell from "@assets/images/IconsSettingsScreen/Bell.svg";
import Globe from "@assets/images/IconsSettingsScreen/Globe.svg";
import Info from "@assets/images/IconsSettingsScreen/Info.svg";
import Help from "@assets/images/IconsSettingsScreen/Help.svg";
import Arrow from "@assets/images/IconsSettingsScreen/Arrow.svg";

function SettingsRow({ title, Icon, onPress, style }) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.row, style]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.left}>
        <View style={styles.iconCircle}>
          <Icon width={18} height={18} />
        </View>

        <Text style={styles.rowText}>{title}</Text>
      </View>

      <Arrow width={30} height={30} />
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const items = [
    { key: "update", title: "Update details", Icon: Pen, onPress: () => console.log("Update details") },
    { key: "account", title: "Account", Icon: ProfileIcon, onPress: () => console.log("Account") },
    { key: "goals", title: "My Goals", Icon: Goal, onPress: () => console.log("My Goals") },
    { key: "premium", title: "Manage Premium", Icon: Premium, onPress: () => console.log("Manage Premium") },
    { key: "privacy", title: "Privacy and Security", Icon: Privacy, onPress: () => console.log("Privacy and Security") },
    { key: "notif", title: "Notifications", Icon: Bell, onPress: () => console.log("Notifications") },
    { key: "lang", title: "Language & Country", Icon: Globe, onPress: () => console.log("Language & Country") },
    { key: "about", title: "About MindSpark", Icon: Info, onPress: () => console.log("About MindSpark") },
    { key: "help", title: "Help & FAQ", Icon: Help, onPress: () => console.log("Help & FAQ") },
  ];

  return (
    <LinearGradient
      colors={["#1A2B00", "#0E0E0E", "#141414"]}
      locations={[0, 0.45, 1]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Settings</Text>

          <View style={styles.list}>
            {items.map((it, idx) => (
              <SettingsRow
                key={it.key}
                title={it.title}
                Icon={it.Icon}
                onPress={it.onPress}
                style={idx === 0 ? null : { marginTop: 12 }}
              />
            ))}
          </View>

          <View style={{ height: 28 }} />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safe: { flex: 1 },

  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },

  title: {
    color: "#FBF8EF",
    fontSize: 24,
    fontFamily: "Montserrat-SemiBold",
    marginBottom: 18,
  },

  list: {
    marginTop: 8,
  },

  row: {
    width: "100%",
    minHeight: 54,
    borderRadius: 30,
    paddingHorizontal: 12,
    backgroundColor: "rgba(58,58,58,0.65)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  rowText: {
    color: "#EAEAEA",
    fontSize: 12,
    marginLeft: 12,
    fontFamily: "Montserrat-Regular",
  },
});