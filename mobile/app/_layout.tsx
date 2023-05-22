import { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as SecureStore from "expo-secure-store";
import { styled } from "nativewind";

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";

import Stripes from "../src/assets/stripes.svg";
import blurBg from "../src/assets/bg-blur.png";

const StyledStripes = styled(Stripes);

export default function Layout() {
  const [isUserAutenticated, setIsUserAutenticated] = useState<null | boolean>(
    null
  );

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  useEffect(() => {
    SecureStore.getItemAsync("token").then((token) => {
      setIsUserAutenticated(!!token); // !! -> converte para boolean
    });
  }, []);

  if (!hasLoadedFonts) {
    return null;
  }

  return (
    <ImageBackground
      source={blurBg}
      className="relative flex-1 bg-gray-900 "
      imageStyle={{ position: "absolute", left: "-100%" }}
    >
      <StyledStripes className="absolute left-2" />
      <StatusBar style="light" translucent />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "trasnsparent" },
        }}
      >
        <Stack.Screen name="index" redirect={isUserAutenticated} />
        <Stack.Screen name="memories" />
        <Stack.Screen name="new" />
      </Stack>
    </ImageBackground>
  );
}
