import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";

import Home from "@assets/images/IconsBottomNavigation/Home.svg";
import Stats from "@assets/images/IconsBottomNavigation/Stats.svg";
import Star from "@assets/images/IconsBottomNavigation/Star.svg";
import Friends from "@assets/images/IconsBottomNavigation/Friends.svg";
import Setting from "@assets/images/IconsBottomNavigation/Setting.svg";

const { width } = Dimensions.get("window");
const TAB_WIDTH = width / 5;
const INDICATOR_SIZE = 60;

function BottomNavigation({ state, descriptors, navigation }) {
  if (!state) return null;

  const { routes, index: activeIndex } = state;

  const anim = useRef(new Animated.Value(0)).current;
  const indicatorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const isStarTab = routes[activeIndex]?.name === "Chat";

    Animated.spring(anim, {
      toValue: activeIndex * TAB_WIDTH + TAB_WIDTH / 2 - INDICATOR_SIZE / 2,
      useNativeDriver: true,
      stiffness: 120,
      damping: 18,
    }).start();

    Animated.timing(indicatorOpacity, {
      toValue: isStarTab ? 0 : 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [activeIndex]);

  const renderIcon = (routeName, isFocused) => {
    switch (routeName) {
      case "Profile":
        return <Home width={23} height={23} />;
      case "Stats":
        return <Stats width={23} height={23} />;
      case "Chat":
        return isFocused ? (
          <View style={styles.starShadowWrapper}>
            <Star width={100} height={100} />
          </View>
        ) : (
          <Star width={100} height={100} />
        );
      case "Friends":
        return <Friends width={23} height={23} />;
      case "Settings":
        return <Setting width={23} height={23} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.bottomNavWrapper}>
      <View style={styles.bottomNav}>
        <Animated.View
          style={[
            styles.activeIndicator,
            {
              transform: [{ translateX: anim }],
              opacity: indicatorOpacity,
            },
          ]}
        />

        {routes.map((route, index) => {
          const isFocused = activeIndex === index;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.navItem}
              activeOpacity={0.8}
              onPress={onPress}
            >
              <View
                style={[
                  styles.navIconContainer,
                  isFocused &&
                    route.name !== "Chat" &&
                    styles.navIconContainerActive,
                ]}
              >
                {renderIcon(route.name, isFocused)}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default BottomNavigation;


const styles = StyleSheet.create({
  bottomNavWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: "#2A2A2A",
    height: 80,
    alignItems: "center",
  },
  activeIndicator: {
    position: "absolute",
    width: INDICATOR_SIZE,
    height: INDICATOR_SIZE,
    borderRadius: INDICATOR_SIZE / 2,
    backgroundColor: "#FBF8EF",
    top: -15,
  },
  navItem: {
    width: TAB_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 10,
  },
  navIconContainer: {
    transform: [{ translateY: -10 }],
  },
  navIconContainerActive: {
    transform: [{ translateY: -20 }],
  },
  starShadowWrapper: {
    shadowColor: "#C7FF10",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 12,
  },
});