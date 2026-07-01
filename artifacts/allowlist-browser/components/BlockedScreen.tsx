import { Feather } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DomainStatus, ReportType, useAppContext } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface BlockedScreenProps {
  domain: string;
  status: DomainStatus;
  reason?: string;
  onGoBack: () => void;
}

export default function BlockedScreen({
  domain,
  status,
  reason,
  onGoBack,
}: BlockedScreenProps) {
  const { strings, addReport } = useAppContext();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const statusConfig = {
    blacklisted: {
      color: colors.destructive,
      bgTint: "#FFF5F5",
      icon: "slash" as const,
      title: strings.blocked.blacklistedTitle,
      subtitle: strings.blocked.blacklistedSubtitle,
      reportType: "wrong_blacklist" as ReportType,
      reportLabel: strings.blocked.reportWrongBlacklist,
    },
    pending: {
      color: colors.pending,
      bgTint: "#FAF5FF",
      icon: "clock" as const,
      title: strings.blocked.pendingTitle,
      subtitle: strings.blocked.pendingSubtitle,
      reportType: null,
      reportLabel: "",
    },
    not_approved: {
      color: colors.mutedForeground,
      bgTint: colors.background,
      icon: "lock" as const,
      title: strings.blocked.notApprovedTitle,
      subtitle: strings.blocked.notApprovedSubtitle,
      reportType: "safe" as ReportType,
      reportLabel: strings.actions.reportSafe,
    },
    allowed: {
      color: colors.success,
      bgTint: "#F0FFF4",
      icon: "check-circle" as const,
      title: strings.states.allowed,
      subtitle: "",
      reportType: null,
      reportLabel: "",
    },
  };

  const cfg = statusConfig[status];

  const handleSubmitReport = () => {
    if (!cfg.reportType) return;
    addReport(domain, cfg.reportType, reportReason.trim());
    setSubmitted(true);
    setShowReportForm(false);
    if (cfg.reportType === "safe") {
      setTimeout(onGoBack, 1200);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 40,
          },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[styles.iconCircle, { backgroundColor: cfg.bgTint }]}
        >
          <Feather name={cfg.icon} size={32} color={cfg.color} />
        </View>

        <Text style={[styles.statusBadge, { color: cfg.color }]}>
          {cfg.title}
        </Text>

        <Text style={[styles.domain, { color: colors.foreground }]}>
          {domain}
        </Text>

        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          {cfg.subtitle}
        </Text>

        {status === "blacklisted" && reason ? (
          <View
            style={[
              styles.reasonBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text
              style={[styles.reasonLabel, { color: colors.mutedForeground }]}
            >
              {strings.blocked.blacklistedReason}
            </Text>
            <Text style={[styles.reasonText, { color: colors.foreground }]}>
              {reason}
            </Text>
          </View>
        ) : null}

        {status === "pending" ? (
          <View
            style={[
              styles.reasonBox,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.reasonText, { color: colors.mutedForeground }]}>
              {strings.blocked.pendingHint}
            </Text>
          </View>
        ) : null}

        {submitted ? (
          <View
            style={[
              styles.reasonBox,
              { backgroundColor: "#F0FFF4", borderColor: colors.success },
            ]}
          >
            <Text style={[styles.reasonText, { color: colors.success }]}>
              {strings.blocked.reportedMessage}
            </Text>
          </View>
        ) : showReportForm ? (
          <View
            style={[
              styles.reportForm,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text
              style={[styles.reasonLabel, { color: colors.mutedForeground }]}
            >
              {strings.blocked.reportFormLabel}
            </Text>
            <TextInput
              value={reportReason}
              onChangeText={setReportReason}
              placeholder={strings.blocked.reportFormPlaceholder}
              placeholderTextColor={colors.mutedForeground}
              style={[
                styles.reportInput,
                {
                  color: colors.foreground,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              multiline
              numberOfLines={3}
            />
            <View style={styles.reportActions}>
              <TouchableOpacity
                onPress={() => setShowReportForm(false)}
                style={styles.cancelBtn}
              >
                <Text
                  style={[
                    styles.cancelBtnText,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {strings.actions.cancel}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmitReport}
                style={[
                  styles.submitBtn,
                  { backgroundColor: colors.primary },
                ]}
              >
                <Text style={styles.submitBtnText}>
                  {strings.blocked.reportSubmit}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : cfg.reportType ? (
          <TouchableOpacity
            style={[
              styles.reportBtn,
              { borderColor: colors.border },
            ]}
            onPress={() => setShowReportForm(true)}
          >
            <Feather name="flag" size={15} color={colors.mutedForeground} />
            <Text style={[styles.reportBtnText, { color: colors.mutedForeground }]}>
              {cfg.reportLabel}
            </Text>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity style={styles.backBtn} onPress={onGoBack}>
          <Feather name="arrow-left" size={16} color={colors.primary} />
          <Text style={[styles.backBtnText, { color: colors.primary }]}>
            {strings.actions.goBack}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 32,
    alignItems: "center",
    gap: 16,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  statusBadge: {
    fontSize: 13,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  domain: {
    fontSize: 20,
    fontFamily: "Inter_600SemiBold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 21,
    maxWidth: 280,
  },
  reasonBox: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    gap: 4,
  },
  reasonLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  reasonText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  reportForm: {
    width: "100%",
    borderRadius: 10,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  reportInput: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    minHeight: 70,
    textAlignVertical: "top",
  },
  reportActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cancelBtnText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
  },
  submitBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  submitBtnText: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  reportBtnText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 12,
    marginTop: 8,
  },
  backBtnText: {
    fontSize: 15,
    fontFamily: "Inter_500Medium",
  },
});
