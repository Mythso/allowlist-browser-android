import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useAppContext } from "@/context/AppContext";

interface StatusBannerProps {
  reason?: string;
  onDismiss: () => void;
  onPress?: () => void;
}

export default function StatusBanner({
  reason,
  onDismiss,
  onPress,
}: StatusBannerProps) {
  const { strings } = useAppContext();
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.delay(3000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity }]}>
      <TouchableOpacity
        style={styles.inner}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.left}>
          <View style={styles.dot} />
          <View>
            <Text style={styles.label}>{strings.states.allowed}</Text>
            {reason ? (
              <Text style={styles.reason} numberOfLines={1}>
                {reason}
              </Text>
            ) : (
              <Text style={styles.tapHint}>{strings.states.allowedTap}</Text>
            )}
          </View>
        </View>
        <TouchableOpacity onPress={onDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Feather name="x" size={16} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#16A34A",
    shadowColor: "#16A34A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  left: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#fff",
    opacity: 0.9,
  },
  label: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  reason: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.8)",
  },
  tapHint: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "rgba(255,255,255,0.65)",
  },
});
