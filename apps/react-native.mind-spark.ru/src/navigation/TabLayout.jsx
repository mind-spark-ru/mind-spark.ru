import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import BottomNavigation from "../components/BottomNavigation";

import ProfileScreen from "../screens/ProfileScreen";
import ChatScreen from "../screens/ChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import StatsScreen from "../screens/StatsScreen";
import FriendsScreen from "../screens/FriendsScreen";
import SoonScreen from "../screens/SoonScreen";

const Tab = createBottomTabNavigator();

export default function TabLayout() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <BottomNavigation {...props} />}
    >
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Stats" component={SoonScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Friends" component={SoonScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}