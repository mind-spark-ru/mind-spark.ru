import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainScreen from "../screens/MainScreen";
import CodeScreen from "../screens/Auth/CodeScreen";
import GoogleLoginScreen from "../screens/Auth/GoogleLoginScreen";
import LoginScreen from "../screens/Auth/LoginScreen";
import RegScreen from "../screens/Auth/RegScreen";
import ErrorScreen from "../screens/ErrorScreen";
import SoonScreen from "../screens/SoonScreen";
import ProfileScreen from "../screens/ProfileScreen";
import TabLayout from "./TabLayout";


const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainScreen} />
        <Stack.Screen name="Reg" component={RegScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Code" component={CodeScreen} />
        <Stack.Screen name="GoogleLogin" component={GoogleLoginScreen} />
        <Stack.Screen name="App" component={TabLayout} />
        <Stack.Screen name="Error" component={ErrorScreen} />
        <Stack.Screen name="Soon" component={SoonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;