import { Feather } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

export default function SettingsScreen() {
  const {
    language,
    setLanguage,
    strings,
    fetchLists,
    isLoadingLists,
    lastUpdated,
    allowlist,
    blacklist,
    reportedDomains,
    allowlistUrl,
    blacklistUrl,
    setAllowlistUrl,
    setBlacklistUrl,
    favorites,
  } = useAppContext();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);
  const [localAllowlistUrl, setLocalAllowlistUrl] = useState(allowlistUrl);
  const [localBlacklistUrl, setLocalBlacklistUrl] = useState(blacklistUrl);

  const bottomPad =
    Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const handleUpdate = async () => {
    setUpdateMsg(null);
    setAllowlistUrl(localAllowlistUrl);
    setBlacklistUrl(localBlacklistUrl);
    try {
      await fetchLists();
      setUpdateMsg(strings.settings.updateSuccess);
    } catch {
      setUpdateMsg(strings.settings.updateFailed);
    }
    setTimeout(() => setUpdateMsg(null), 3000);
  };

  const handleExport = async () => {
    const text = favorites
      .map((f) => `${f.domain} — ${f.url}`)
      .join("\n");
    if (Platform.OS === "web") {
      Alert.alert(strings.favorites.exportTitle, text || "(ingen)");
    } else {
      await Clipboard.setStringAsync(text);
      Alert.alert(strings.favorites.exportTitle, strings.favorites.exportDone);
    }
  };

  const formatDate = (ts: number | null): string => {
    if (!ts) return strings.settings.never;
    const d = new Date(ts);
    return d.toLocaleDateString(language === "no" ? "nb-NO" : "en-US", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: bottomPad + 90 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      {/* Language */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          {strings.settings.languageSection}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.langRow}>
            {(["no", "en"] as const).map((lang) => {
              const label =
                lang === "no"
                  ? strings.settings.languageNorwegian
                  : strings.settings.languageEnglish;
              const isActive = language === lang;
              return (
                <TouchableOpacity
                  key={lang}
                  style={[
                    styles.langBtn,
                    isActive && { backgroundColor: colors.primary },
                    !isActive && { backgroundColor: colors.secondary },
                  ]}
                  onPress={() => setLanguage(lang)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.langBtnText,
                      {
                        color: isActive
                          ? colors.primaryForeground
                          : colors.mutedForeground,
                        fontFamily: isActive
                          ? "Inter_600SemiBold"
                          : "Inter_400Regular",
                      },
                    ]}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Lists */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          {strings.settings.listsSection}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
              {strings.settings.allowlistUrl}
            </Text>
            <TextInput
              value={localAllowlistUrl}
              onChangeText={setLocalAllowlistUrl}
              style={[
                styles.fieldInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              placeholder={strings.settings.csvUrlHint}
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
              {strings.settings.blacklistUrl}
            </Text>
            <TextInput
              value={localBlacklistUrl}
              onChangeText={setLocalBlacklistUrl}
              style={[
                styles.fieldInput,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.border,
                  color: colors.foreground,
                },
              ]}
              placeholder={strings.settings.csvUrlHint}
              placeholderTextColor={colors.mutedForeground}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <TouchableOpacity
            style={[
              styles.updateBtn,
              { backgroundColor: colors.primary },
              isLoadingLists && { opacity: 0.7 },
            ]}
            onPress={handleUpdate}
            disabled={isLoadingLists}
            activeOpacity={0.8}
          >
            {isLoadingLists ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="refresh-cw" size={16} color="#fff" />
            )}
            <Text style={styles.updateBtnText}>
              {isLoadingLists
                ? strings.settings.updating
                : strings.settings.updateButton}
            </Text>
          </TouchableOpacity>

          {updateMsg && (
            <Text style={[styles.updateMsg, { color: colors.success }]}>
              {updateMsg}
            </Text>
          )}

          <View style={styles.lastUpdatedRow}>
            <Feather name="clock" size={13} color={colors.mutedForeground} />
            <Text style={[styles.lastUpdatedText, { color: colors.mutedForeground }]}>
              {strings.settings.lastUpdated}: {formatDate(lastUpdated)}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          {strings.settings.aboutSection}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.statRow}>
            <View style={[styles.statDot, { backgroundColor: colors.success }]} />
            <Text style={[styles.statLabel, { color: colors.foreground }]}>
              {strings.settings.allowlistCount}
            </Text>
            <Text style={[styles.statCount, { color: colors.primary }]}>
              {allowlist.size}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.statRow}>
            <View style={[styles.statDot, { backgroundColor: colors.destructive }]} />
            <Text style={[styles.statLabel, { color: colors.foreground }]}>
              {strings.settings.blacklistCount}
            </Text>
            <Text style={[styles.statCount, { color: colors.primary }]}>
              {blacklist.size}
            </Text>
          </View>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.statRow}>
            <View style={[styles.statDot, { backgroundColor: colors.pending }]} />
            <Text style={[styles.statLabel, { color: colors.foreground }]}>
              {strings.settings.pendingCount}
            </Text>
            <Text style={[styles.statCount, { color: colors.primary }]}>
              {reportedDomains.size}
            </Text>
          </View>
        </View>
      </View>

      {/* Favorites Export */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>
          {strings.settings.favoritesSection}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.exportBtn, { borderColor: colors.border }]}
            onPress={handleExport}
            activeOpacity={0.7}
          >
            <Feather name="download" size={18} color={colors.primary} />
            <Text style={[styles.exportBtnText, { color: colors.primary }]}>
              {strings.settings.exportButton}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 24,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  langRow: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  langBtnText: {
    fontSize: 15,
  },
  field: {
    padding: 14,
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.3,
  },
  fieldInput: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginHorizontal: 14,
  },
  updateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    margin: 14,
    paddingVertical: 13,
    borderRadius: 12,
  },
  updateBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  updateMsg: {
    textAlign: "center",
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    paddingBottom: 10,
  },
  lastUpdatedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingBottom: 12,
  },
  lastUpdatedText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statLabel: {
    flex: 1,
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
  statCount: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
  },
  exportBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
  // Colors not in useColors - inline in constants
  success: {},
  pending: {},
});
