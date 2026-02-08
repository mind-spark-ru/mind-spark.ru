import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Main from "@/screens/Main";
import Reg from "@/screens/Auth/Reg";
import Login from "@/screens/Auth/Login";
import Code from "@/screens/Auth/Code";
import Profile from "@/screens/Profile";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Reg" component={Reg} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Code" component={Code} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}