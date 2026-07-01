import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppContext } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface StartPageProps {
  onNavigate: (url: string) => void;
}

export default function StartPage({ onNavigate }: StartPageProps) {
  const { strings, favorites } = useAppContext();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [input, setInput] = useState("");
  const [focused, setFocused] = useState(false);

  const topPad = Platform.OS === "web" ? Math.max(insets.top, 67) : insets.top;

  const handleSubmit = () => {
    if (input.trim()) {
      onNavigate(input.trim());
      setInput("");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingTop: topPad + 32, paddingBottom: insets.bottom + 120 },
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Feather name="shield" size={28} color={colors.primary} />
        <Text style={[styles.title, { color: colors.foreground }]}>
          {strings.home.startTitle}
        </Text>
      </View>

      <View
        style={[
          styles.searchBar,
          {
            backgroundColor: colors.card,
            borderColor: focused ? colors.primary : colors.border,
          },
        ]}
      >
        <Feather
          name="search"
          size={16}
          color={focused ? colors.primary : colors.mutedForeground}
        />
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSubmit}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={strings.home.searchPlaceholder}
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          returnKeyType="go"
        />
      </View>

      {favorites.length > 0 ? (
        <View style={styles.section}>
          <Text
            style={[styles.sectionLabel, { color: colors.mutedForeground }]}
          >
            {strings.home.quickAccess}
          </Text>
          <View style={styles.grid}>
            {favorites.map((fav) => (
              <TouchableOpacity
                key={fav.id}
                style={[
                  styles.gridItem,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
                onPress={() => onNavigate(fav.url)}
                activeOpacity={0.6}
              >
                <Image
                  source={{
                    uri: `https://www.google.com/s2/favicons?domain=${fav.domain}&sz=64`,
                  }}
                  style={styles.favicon}
                />
                <Text
                  style={[styles.gridLabel, { color: colors.foreground }]}
                  numberOfLines={1}
                >
                  {fav.domain}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
            {strings.home.noFavorites}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    gap: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontFamily: "Inter_600SemiBold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    paddingVertical: 0,
  },
  section: { gap: 10 },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  gridItem: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 8,
  },
  favicon: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: "#f0f0f0",
  },
  gridLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  empty: {
    paddingTop: 20,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
  },
});
