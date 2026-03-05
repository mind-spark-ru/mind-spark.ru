import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
} from "react-native";

function SoonScreen({ navigation }) {
  const handleGoBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={require("../../assets/images/Error_screen.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.content}>
          <Text style={styles.title}>SOON!</Text>
          <Text style={styles.subtitle}>
            Just wait, this feature is in development...
          </Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleGoBackPress}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>GO BACK</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
}

export default SoonScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141414",
  },
  background: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  content: {
    marginTop: 125,
    marginLeft: 132,
    marginRight: 20,
  },
  title: {
    fontFamily: "Montserrat-SemiBold",
    color: "#FBF8EF",
    fontSize: 30,
    fontWeight: "700",
    marginBottom: 10,
  },
  subtitle: {
    fontFamily: "Montserrat-Regular",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    textAlign: "center",
  },
  button: {
    width: "90%",
    borderWidth: 2,
    borderColor: "#FBF8EF",
    borderRadius: 40,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 30,
  },
  buttonText: {
    fontFamily: "Montserrat-SemiBold",
    color: "#FBF8EF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 1,
  },
});