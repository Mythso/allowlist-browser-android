import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { SymbolView } from "expo-symbols";
import React from "react";
import { Platform, StyleSheet, useColorScheme, View } from "react-native";

import { useAppContext } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

function NativeTabLayout() {
  const { strings } = useAppContext();
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: "house", selected: "house.fill" }} />
        <Label>{strings.tabs.home}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="favorites">
        <Icon sf={{ default: "star", selected: "star.fill" }} />
        <Label>{strings.tabs.favorites}</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon sf={{ default: "gearshape", selected: "gearshape.fill" }} />
        <Label>{strings.tabs.settings}</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const { strings } = useAppContext();
  const isDark = useColorScheme() === "dark";
  const isIOS = Platform.OS === "ios";

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: true,
        headerStyle: { backgroundColor: colors.card },
        headerShadowVisible: false,
        headerTintColor: colors.foreground,
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold",
          fontSize: 17,
        },
        tabBarStyle: {
          position: "absolute",
          backgroundColor: isIOS ? "transparent" : colors.card,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: colors.border,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={80}
              tint={isDark ? "dark" : "systemChromeMaterial"}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[StyleSheet.absoluteFill, { backgroundColor: colors.card }]}
            />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: strings.tabs.home,
          headerShown: false,
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={22} />
            ) : (
              <Feather name="home" size={21} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: strings.tabs.favorites,
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="star" tintColor={color} size={22} />
            ) : (
              <Feather name="star" size={21} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: strings.tabs.settings,
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="gearshape" tintColor={color} size={22} />
            ) : (
              <Feather name="settings" size={21} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  if (isLiquidGlassAvailable()) return <NativeTabLayout />;
  return <ClassicTabLayout />;
}
