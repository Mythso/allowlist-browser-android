import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppContext } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface BrowserBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isLoading: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  onRefresh: () => void;
  onGoHome: () => void;
  showFavorite: boolean;
  isFavorite: boolean;
  onFavorite: () => void;
}

export default function BrowserBar({
  value,
  onChangeText,
  onSubmit,
  canGoBack,
  canGoForward,
  isLoading,
  onGoBack,
  onGoForward,
  onRefresh,
  onGoHome,
  showFavorite,
  isFavorite,
  onFavorite,
}: BrowserBarProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { strings } = useAppContext();
  const [focused, setFocused] = useState(false);

  const topPad =
    Platform.OS === "web"
      ? Math.max(insets.top, 67)
      : insets.top;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topPad + 6,
          paddingBottom: 10,
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.navRow}>
        <TouchableOpacity
          style={[styles.iconBtn, !canGoBack && styles.iconBtnDisabled]}
          onPress={onGoBack}
          disabled={!canGoBack}
        >
          <Feather
            name="arrow-left"
            size={20}
            color={canGoBack ? colors.foreground : colors.mutedForeground}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.iconBtn, !canGoForward && styles.iconBtnDisabled]}
          onPress={onGoForward}
          disabled={!canGoForward}
        >
          <Feather
            name="arrow-right"
            size={20}
            color={canGoForward ? colors.foreground : colors.mutedForeground}
          />
        </TouchableOpacity>

        <View
          style={[
            styles.urlBar,
            {
              backgroundColor: colors.background,
              borderColor: focused ? colors.primary : colors.border,
            },
          ]}
        >
          <TextInput
            value={value}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmit}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={strings.home.searchPlaceholder}
            placeholderTextColor={colors.mutedForeground}
            style={[styles.urlInput, { color: colors.foreground }]}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            returnKeyType="go"
            selectTextOnFocus
          />
          {isLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
              <Feather name="refresh-cw" size={15} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={styles.iconBtn} onPress={onGoHome}>
          <Feather name="home" size={20} color={colors.foreground} />
        </TouchableOpacity>

        {showFavorite && (
          <TouchableOpacity style={styles.iconBtn} onPress={onFavorite}>
            <Feather
              name="star"
              size={20}
              color={isFavorite ? colors.warning : colors.mutedForeground}
              style={isFavorite ? styles.starFilled : undefined}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
  },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  iconBtnDisabled: {
    opacity: 0.35,
  },
  urlBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    paddingHorizontal: 10,
    gap: 6,
  },
  urlInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    paddingVertical: 0,
  },
  refreshBtn: {
    padding: 2,
  },
  starFilled: {
    // tint is handled via color prop
  },
});
