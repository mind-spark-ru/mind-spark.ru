import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import IconAlert from "../../assets/images/Icon_alert.svg";

function CustomAlert({ visible, message, onClose }) {
  if (!visible) return null;

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <IconAlert width={44} height={44} style={styles.icon} />

          <Text style={styles.message}>{message}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>TRY AGAIN</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default CustomAlert;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    width: "85%",
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  icon: {
    marginBottom: 15,
  },
  message: {
    color: "#FBF8EF",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.8,
    fontFamily: "Montserrat-Regular",
  },
  button: {
    width: "100%",
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#FBF8EF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FBF8EF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Montserrat-SemiBold",
  },
});