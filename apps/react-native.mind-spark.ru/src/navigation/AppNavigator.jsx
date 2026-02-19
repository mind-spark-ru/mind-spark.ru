import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Main from "@/screens/Main";
import Reg from "@/screens/Auth/Reg";
import Login from "@/screens/Auth/Login";
import Code from "@/screens/Auth/Code";
import Profile from "@/screens/Profile";
import GoogleLogin from "@/screens/Auth/GoogleLogin"
import ErrorScreen from "@/screens/ErrorScreen";
import SoonScreen from "@/screens/SoonScreen"

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Reg" component={Reg} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Code" component={Code} />
        <Stack.Screen name="GoogleLogin" component={GoogleLogin} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="Error" component={ErrorScreen} />
        <Stack.Screen name="Soon" component={SoonScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}