import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { useFonts } from 'expo-font';
import Logotype from './assets/images/Logotype.js';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logotype />
      </View>

      <TextInput
        style={styles.input}
        placeholder="e-mail"
        placeholderTextColor='rgba(255, 255, 255, 0.3)'
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="password"
        placeholderTextColor='rgba(255, 255, 255, 0.3)'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or</Text>

      <TouchableOpacity style={styles.signUpButton}>
        <Text style={styles.signUpText}>SIGN UP</Text>
      </TouchableOpacity>

      <View style={styles.browserContainer}>
        <TouchableOpacity style={styles.browserButton}>
          <Image source={require('./assets/images/browsers/Yandex.png')} style={styles.browserImage} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.browserButton}>
          <Image source={require('./assets/images/browsers/Google.png')} style={styles.browserImage} />
        </TouchableOpacity>
      </View>

      <StatusBar style="light" />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#141414',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  logoContainer: {
    marginBottom: 30,
    alignSelf: 'center',
  },

  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: "#FBF8EF",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: "#ffffff",
    marginBottom: 8,
  },

  loginButton: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    backgroundColor: '#FBF8EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  loginText: {
    fontFamily: "Montserrat-Medium",
    color: '#141414',
    fontWeight: '600',
    letterSpacing: 0,
  },

  or: {
    color: '#777',
    marginVertical: 12,
  },

  signUpButton: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    backgroundColor: '#C7FF1A',
    alignItems: 'center',
    justifyContent: 'center',
  },

  signUpText: {
    fontFamily: "Montserrat-Medium",
    color: '#141414',
    fontWeight: '600',
    letterSpacing: 0,
  },

  browserContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },

  browserButton: {
    width: 50,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FBF8EF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  browserImage: {
    width: 35,
    height: 35,
  },
});
