import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Favorite, useAppContext } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

export default function FavoritesScreen() {
  const { favorites, removeFavorite, strings, setPendingNavigationUrl } =
    useAppContext();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const handleTap = (fav: Favorite) => {
    setPendingNavigationUrl(fav.url);
    router.navigate("/");
  };

  const handleRemove = (fav: Favorite) => {
    Alert.alert(
      strings.actions.removeFavorite,
      fav.domain,
      [
        { text: strings.actions.cancel, style: "cancel" },
        {
          text: strings.actions.removeFavorite,
          style: "destructive",
          onPress: () => removeFavorite(fav.domain),
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: Favorite }) => (
    <TouchableOpacity
      style={[
        styles.item,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
        },
      ]}
      onPress={() => handleTap(item)}
      activeOpacity={0.7}
    >
      <Image
        source={{
          uri: `https://www.google.com/s2/favicons?domain=${item.domain}&sz=64`,
        }}
        style={styles.favicon}
      />
      <View style={styles.itemText}>
        <Text
          style={[styles.itemDomain, { color: colors.foreground }]}
          numberOfLines={1}
        >
          {item.domain}
        </Text>
        <Text
          style={[styles.itemUrl, { color: colors.mutedForeground }]}
          numberOfLines={1}
        >
          {item.url}
        </Text>
      </View>
      <TouchableOpacity
        style={[styles.removeBtn, { backgroundColor: colors.background }]}
        onPress={() => handleRemove(item)}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Feather name="trash-2" size={16} color={colors.destructive} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const bottomPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={[
          styles.list,
          { paddingBottom: bottomPad + 90 },
        ]}
        scrollEnabled={!!favorites.length}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="star" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.mutedForeground }]}>
              {strings.favorites.empty}
            </Text>
            <Text
              style={[styles.emptyHint, { color: colors.mutedForeground }]}
            >
              {strings.favorites.emptyHint}
            </Text>
          </View>
        }
        ItemSeparatorComponent={() => (
          <View style={[styles.separator, { backgroundColor: colors.border }]} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingTop: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  favicon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  itemText: {
    flex: 1,
    gap: 2,
  },
  itemDomain: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  itemUrl: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  removeBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 68,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
    opacity: 0.5,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  emptyHint: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 21,
  },
});
