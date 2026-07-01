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

  const topPad =
    Platform.OS === "web"
      ? Math.max(insets.top, 67)
      : insets.top;

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
        { paddingTop: topPad + 24, paddingBottom: insets.bottom + 100 },
      ]}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <View
          style={[
            styles.logoCircle,
            { backgroundColor: colors.primary },
          ]}
        >
          <Feather name="shield" size={28} color="#fff" />
        </View>
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
            shadowColor: colors.primary,
          },
        ]}
      >
        <Feather
          name="search"
          size={18}
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
        {input.length > 0 && (
          <TouchableOpacity onPress={handleSubmit} style={styles.goBtn}>
            <View style={[styles.goBtnInner, { backgroundColor: colors.primary }]}>
              <Feather name="arrow-right" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {favorites.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
            {strings.home.quickAccess}
          </Text>
          <View style={styles.grid}>
            {favorites.map((fav) => (
              <TouchableOpacity
                key={fav.id}
                style={[styles.gridItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => onNavigate(fav.url)}
                activeOpacity={0.7}
              >
                <Image
                  source={{
                    uri: `https://www.google.com/s2/favicons?domain=${fav.domain}&sz=64`,
                  }}
                  style={styles.favicon}
                  defaultSource={undefined}
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
      )}

      {favorites.length === 0 && (
        <View style={styles.emptyState}>
          <Feather name="star" size={32} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.mutedForeground }]}>
            {strings.home.noFavorites}
          </Text>
          <Text style={[styles.emptyHint, { color: colors.mutedForeground }]}>
            {strings.home.noFavoritesHint}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    alignItems: "stretch",
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    gap: 12,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    letterSpacing: -0.5,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    height: 54,
    gap: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    marginBottom: 32,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    paddingVertical: 0,
  },
  goBtn: {
    padding: 2,
  },
  goBtnInner: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridItem: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 8,
  },
  favicon: {
    width: 36,
    height: 36,
    borderRadius: 8,
  },
  gridLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
  },
  emptyState: {
    alignItems: "center",
    gap: 10,
    paddingTop: 32,
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  emptyHint: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});
