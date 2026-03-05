import { useFonts } from "expo-font";

export const useAppFonts = () => {
  const [fontsLoaded, fontError] = useFonts({
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Regular": require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Italic": require("../../assets/fonts/Montserrat-Italic.ttf"),
  });

  return { fontsLoaded, fontError };
};