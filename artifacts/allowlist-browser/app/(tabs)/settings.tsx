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
    pendingList,
    allowlistUrl,
    blacklistUrl,
    setAllowlistUrl,
    setBlacklistUrl,
    favorites,
    userReports,
    addReport,
    clearReport,
  } = useAppContext();

  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [localAllowUrl, setLocalAllowUrl] = useState(allowlistUrl);
  const [localBlackUrl, setLocalBlackUrl] = useState(blacklistUrl);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  const [reportUrl, setReportUrl] = useState("");
  const [reportReason, setReportReason] = useState("");
  const [reportMsg, setReportMsg] = useState<string | null>(null);

  const bottomPad = Platform.OS === "web" ? Math.max(insets.bottom, 34) : insets.bottom;

  const handleUpdate = async () => {
    setUpdateMsg(null);
    setAllowlistUrl(localAllowUrl);
    setBlacklistUrl(localBlackUrl);
    const res = await fetchLists();
    setUpdateMsg(
      res.success ? strings.settings.updateSuccess : strings.settings.updateFailed
    );
    setTimeout(() => setUpdateMsg(null), 4000);
  };

  const handleExport = async () => {
    const text = favorites.map((f) => `${f.domain} — ${f.url}`).join("\n");
    if (Platform.OS === "web") {
      Alert.alert(strings.favorites.exportTitle, text || "—");
    } else {
      await Clipboard.setStringAsync(text || "—");
      Alert.alert(strings.favorites.exportTitle, strings.favorites.exportDone);
    }
  };

  const handleReportAllowlisted = () => {
    const domain = reportUrl.trim().replace(/^https?:\/\//, "").replace(/\/.*$/, "").toLowerCase();
    if (!domain) return;
    addReport(domain, "wrong_allowlist", reportReason.trim());
    setReportUrl("");
    setReportReason("");
    setReportMsg(strings.settings.reportSuccess);
    setTimeout(() => setReportMsg(null), 3000);
  };

  const fmtDate = (ts: number | null) => {
    if (!ts) return strings.settings.never;
    return new Date(ts).toLocaleDateString(
      language === "no" ? "nb-NO" : "en-US",
      { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }
    );
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
      <Section label={strings.settings.languageSection} colors={colors}>
        <Row colors={colors}>
          {(["no", "en"] as const).map((lang, i) => {
            const active = language === lang;
            const label = lang === "no" ? strings.settings.languageNorwegian : strings.settings.languageEnglish;
            return (
              <TouchableOpacity
                key={lang}
                onPress={() => setLanguage(lang)}
                style={[
                  styles.langBtn,
                  i === 0 && styles.langBtnLeft,
                  i === 1 && styles.langBtnRight,
                  active
                    ? { backgroundColor: colors.primary }
                    : { backgroundColor: colors.secondary },
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.langBtnText,
                    {
                      color: active ? "#fff" : colors.mutedForeground,
                      fontFamily: active ? "Inter_600SemiBold" : "Inter_400Regular",
                    },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Row>
      </Section>

      {/* Lists */}
      <Section label={strings.settings.listsSection} colors={colors}>
        <FieldRow label={strings.settings.allowlistUrl} colors={colors}>
          <TextInput
            value={localAllowUrl}
            onChangeText={setLocalAllowUrl}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder={strings.settings.csvUrlHint}
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </FieldRow>

        <Divider colors={colors} />

        <FieldRow label={strings.settings.blacklistUrl} colors={colors}>
          <TextInput
            value={localBlackUrl}
            onChangeText={setLocalBlackUrl}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder={strings.settings.csvUrlHint}
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </FieldRow>

        <Divider colors={colors} />

        <View style={styles.rowPad}>
          <TouchableOpacity
            onPress={handleUpdate}
            disabled={isLoadingLists}
            style={[
              styles.primaryBtn,
              { backgroundColor: colors.primary, opacity: isLoadingLists ? 0.6 : 1 },
            ]}
            activeOpacity={0.8}
          >
            {isLoadingLists ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Feather name="refresh-cw" size={15} color="#fff" />
            )}
            <Text style={styles.primaryBtnText}>
              {isLoadingLists ? strings.settings.updating : strings.settings.updateButton}
            </Text>
          </TouchableOpacity>

          {updateMsg ? (
            <Text style={[styles.msg, { color: updateMsg.includes("ikke") || updateMsg.includes("not") ? colors.destructive : colors.success }]}>
              {updateMsg}
            </Text>
          ) : null}

          <Text style={[styles.meta, { color: colors.mutedForeground }]}>
            {strings.settings.lastUpdated}: {fmtDate(lastUpdated)}
          </Text>
        </View>
      </Section>

      {/* Stats */}
      <Section label={strings.settings.statsSection} colors={colors}>
        <StatRow label={strings.settings.allowlistCount} value={allowlist.size} dot={colors.success} colors={colors} />
        <Divider colors={colors} />
        <StatRow label={strings.settings.blacklistCount} value={blacklist.size} dot={colors.destructive} colors={colors} />
        <Divider colors={colors} />
        <StatRow label={strings.settings.pendingCount} value={pendingList.size} dot={colors.pending} colors={colors} />
      </Section>

      {/* Report allowlisted site */}
      <Section label={strings.settings.reportSection} colors={colors}>
        <FieldRow label={strings.settings.reportUrlLabel} colors={colors}>
          <TextInput
            value={reportUrl}
            onChangeText={setReportUrl}
            style={[styles.input, { color: colors.foreground, borderColor: colors.border }]}
            placeholder={strings.settings.reportUrlPlaceholder}
            placeholderTextColor={colors.mutedForeground}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </FieldRow>

        <Divider colors={colors} />

        <FieldRow label={strings.settings.reportReasonLabel} colors={colors}>
          <TextInput
            value={reportReason}
            onChangeText={setReportReason}
            style={[styles.input, styles.multiInput, { color: colors.foreground, borderColor: colors.border }]}
            placeholder={strings.settings.reportReasonPlaceholder}
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </FieldRow>

        <Divider colors={colors} />

        <View style={styles.rowPad}>
          <TouchableOpacity
            onPress={handleReportAllowlisted}
            disabled={!reportUrl.trim()}
            style={[
              styles.primaryBtn,
              { backgroundColor: colors.primary, opacity: reportUrl.trim() ? 1 : 0.5 },
            ]}
            activeOpacity={0.8}
          >
            <Feather name="flag" size={15} color="#fff" />
            <Text style={styles.primaryBtnText}>{strings.settings.reportSubmitBtn}</Text>
          </TouchableOpacity>
          {reportMsg ? (
            <Text style={[styles.msg, { color: colors.success }]}>{reportMsg}</Text>
          ) : null}
        </View>
      </Section>

      {/* My reports */}
      <Section label={strings.settings.myReportsSection} colors={colors}>
        {userReports.length === 0 ? (
          <View style={styles.rowPad}>
            <Text style={[styles.meta, { color: colors.mutedForeground }]}>
              {strings.settings.noReports}
            </Text>
          </View>
        ) : (
          userReports.map((r, i) => (
            <React.Fragment key={r.id}>
              {i > 0 && <Divider colors={colors} />}
              <View style={[styles.rowPad, styles.reportRow]}>
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={[styles.reportDomain, { color: colors.foreground }]}>
                    {r.domain}
                  </Text>
                  <Text style={[styles.meta, { color: colors.mutedForeground }]}>
                    {strings.settings.reportTypeLabels[r.type]}
                  </Text>
                  {r.reason ? (
                    <Text style={[styles.meta, { color: colors.mutedForeground }]}>
                      {r.reason}
                    </Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  onPress={() => clearReport(r.id)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={[styles.meta, { color: colors.destructive }]}>
                    {strings.settings.deleteReport}
                  </Text>
                </TouchableOpacity>
              </View>
            </React.Fragment>
          ))
        )}
      </Section>

      {/* Favorites */}
      <Section label={strings.settings.favoritesSection} colors={colors}>
        <View style={styles.rowPad}>
          <TouchableOpacity
            onPress={handleExport}
            style={[styles.outlineBtn, { borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <Feather name="download" size={15} color={colors.primary} />
            <Text style={[styles.outlineBtnText, { color: colors.primary }]}>
              {strings.settings.exportButton}
            </Text>
          </TouchableOpacity>
        </View>
      </Section>
    </ScrollView>
  );
}

/* ── Small layout helpers ── */

function Section({
  label,
  colors,
  children,
}: {
  label: string;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>
        {label.toUpperCase()}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

function Row({
  colors,
  children,
}: {
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  children: React.ReactNode;
}) {
  return <View style={styles.rowPad}>{children}</View>;
}

function FieldRow({
  label,
  colors,
  children,
}: {
  label: string;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  children: React.ReactNode;
}) {
  return (
    <View style={[styles.rowPad, { gap: 6 }]}>
      <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
        {label}
      </Text>
      {children}
    </View>
  );
}

function Divider({
  colors,
}: {
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <View
      style={[styles.divider, { backgroundColor: colors.border }]}
    />
  );
}

function StatRow({
  label,
  value,
  dot,
  colors,
}: {
  label: string;
  value: number;
  dot: string;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
}) {
  return (
    <View style={[styles.rowPad, styles.statRow]}>
      <View style={[styles.dot, { backgroundColor: dot }]} />
      <Text style={[styles.statLabel, { color: colors.foreground }]}>{label}</Text>
      <Text style={[styles.statValue, { color: colors.primary }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 28,
  },
  section: { gap: 6 },
  sectionLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.8,
    paddingHorizontal: 4,
  },
  card: {
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: "hidden",
  },
  rowPad: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 14,
  },
  langBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  langBtnLeft: { marginRight: 4 },
  langBtnRight: { marginLeft: 4 },
  langBtnText: { fontSize: 14 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  multiInput: {
    minHeight: 64,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 12,
    borderRadius: 10,
  },
  primaryBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  outlineBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  msg: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    textAlign: "center",
    marginTop: 8,
  },
  meta: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    marginTop: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statLabel: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
  },
  reportRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  reportDomain: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
});
