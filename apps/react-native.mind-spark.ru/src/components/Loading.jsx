import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Star from "@assets/images/IconsMainScreen/Star.svg";

const Loading = ({ visible = true }) => {
  const shadowOpacity = useRef(new Animated.Value(0.3)).current;
  const shadowRadius = useRef(new Animated.Value(10)).current;
  const starScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(shadowOpacity, {
            toValue: 0.9,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(shadowRadius, {
            toValue: 30,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(starScale, {
            toValue: 1.1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(shadowOpacity, {
            toValue: 0.3,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(shadowRadius, {
            toValue: 10,
            duration: 1200,
            useNativeDriver: false,
          }),
          Animated.timing(starScale, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, []);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.shadowContainer,
            {
              shadowOpacity,
              shadowRadius,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.starWrapper,
              {
                transform: [{ scale: starScale }],
              },
            ]}
          >
            <Star width={100} height={100} />
          </Animated.View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(20, 20, 20, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadowContainer: {
    shadowColor: '#C7FF10',
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  starWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loading;