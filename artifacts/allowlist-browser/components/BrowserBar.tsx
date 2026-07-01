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

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: topPad + 8,
          paddingBottom: 8,
          backgroundColor: colors.card,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.row}>
        <TouchableOpacity
          onPress={onGoBack}
          disabled={!canGoBack}
          style={[styles.iconBtn, !canGoBack && { opacity: 0.3 }]}
        >
          <Feather name="chevron-left" size={22} color={colors.foreground} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onGoForward}
          disabled={!canGoForward}
          style={[styles.iconBtn, !canGoForward && { opacity: 0.3 }]}
        >
          <Feather name="chevron-right" size={22} color={colors.foreground} />
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
            <ActivityIndicator
              size="small"
              color={colors.mutedForeground}
              style={styles.rightBtn}
            />
          ) : (
            <TouchableOpacity onPress={onRefresh} style={styles.rightBtn}>
              <Feather name="refresh-cw" size={14} color={colors.mutedForeground} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity onPress={onGoHome} style={styles.iconBtn}>
          <Feather name="home" size={18} color={colors.foreground} />
        </TouchableOpacity>

        {showFavorite && (
          <TouchableOpacity onPress={onFavorite} style={styles.iconBtn}>
            <Feather
              name={isFavorite ? "star" : "star"}
              size={18}
              color={isFavorite ? colors.warning : colors.mutedForeground}
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
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  iconBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },
  urlBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  urlInput: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    paddingVertical: 0,
  },
  rightBtn: {
    padding: 2,
  },
});
