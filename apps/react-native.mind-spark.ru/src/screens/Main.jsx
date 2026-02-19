import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from "react-native";
import { useFonts } from 'expo-font';
import Logotype from '@assets/images/Logotype.js';
import { useAppFonts } from '@/hooks/useAppFonts';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";

export default function Main({ navigation }) {
  const { fontsLoaded } = useAppFonts();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        if (token) {
          navigation.navigate("Profile");
        }
      } catch (e) {
      }
    };
    checkAuth();
  }, [navigation]);

  return (
    <ImageBackground
      source={require('@assets/images/Main_screen.png')}
      style={styles.background}
    >

      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Logotype />
          <Text style={styles.tagline}>INTELLIGENCE IN EVERY STEP</Text>
        </View>

        <TouchableOpacity
            style={styles.signUpButton}
            onPress={() => navigation.navigate("Reg")}
        >
          <Text style={styles.signUpText}>SIGN UP</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.socialButton}
          onPress={() => navigation.navigate("Soon")}
        >
          <Image source={require('@assets/images/browsers/Yandex.png')} style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue with Yandex</Text>
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.socialButton}
            onPress={() => navigation.navigate("GoogleLogin")}
        >
          <Image source={require('@assets/images/browsers/Google.png')} style={styles.socialIcon} />
          <Text style={styles.socialText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.loginText}>LOG IN</Text>
        </TouchableOpacity>

        <StatusBar style="light" />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 330,
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  tagline: {
    fontFamily: 'Montserrat-Regular',
    color: '#FBF8EF',
    fontSize: 10,
    marginTop: 3,
    textAlign: 'center',
    letterSpacing: 2,
  },
  signUpButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    backgroundColor: '#C7FF10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  signUpText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#141414',
    fontWeight: '600',
    fontSize: 15,
  },
  socialButton: {
    width: '100%',
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#FBF8EF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  socialIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  socialText: {
    fontFamily: 'Montserrat-SemiBold',
    color: '#FBF8EF',
    fontSize: 15,
  },
  loginLink: {
    marginTop: 15,
  },
  loginText: {
    fontFamily: 'Montserrat-Medium',
    color: '#FBF8EF',
    fontSize: 15,
  },
});