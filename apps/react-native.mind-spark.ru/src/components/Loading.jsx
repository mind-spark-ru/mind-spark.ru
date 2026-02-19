import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import StarIcon from "@assets/images/IconsMainScreen/Star.svg";

const Loading = ({ visible = true }) => {
  const shadowOpacityAnim = useRef(new Animated.Value(0.3)).current;
  const shadowRadiusAnim = useRef(new Animated.Value(10)).current;
  const starScaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loopAnimation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(shadowOpacityAnim, {
            toValue: 0.9,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(shadowRadiusAnim, {
            toValue: 30,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(starScaleAnim, {
            toValue: 1.1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(shadowOpacityAnim, {
            toValue: 0.3,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(shadowRadiusAnim, {
            toValue: 10,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(starScaleAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    loopAnimation.start();

    return () => {
      loopAnimation.stop();
    };
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.shadowContainer,
            {
              shadowOpacity: shadowOpacityAnim,
              shadowRadius: shadowRadiusAnim,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.starWrapper,
              {
                transform: [{ scale: starScaleAnim }],
              },
            ]}
          >
            <StarIcon width={100} height={100} />
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(20, 20, 20, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  shadowContainer: {
    shadowColor: "#C7FF10",
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  starWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});