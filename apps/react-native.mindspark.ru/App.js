import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Main from "./Main";
import Reg from "./Reg";
import Login from "./Login";
import Code from "./Code";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={Main} />
        <Stack.Screen name="Reg" component={Reg} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Code" component={Code} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
