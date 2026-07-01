import { Feather } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DomainStatus } from "@/context/AppContext";
import { useAppContext } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

interface BlockedScreenProps {
  domain: string;
  status: DomainStatus;
  reason?: string;
  onGoBack: () => void;
  onReport?: () => void;
}

export default function BlockedScreen({
  domain,
  status,
  reason,
  onGoBack,
  onReport,
}: BlockedScreenProps) {
  const { strings, addReported } = useAppContext();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const handleReport = () => {
    addReported(domain);
    onReport?.();
  };

  const config = {
    blacklisted: {
      bgColor: "#DC2626",
      iconBg: "rgba(255,255,255,0.15)",
      icon: "slash" as const,
      title: strings.blocked.blacklistedTitle,
      subtitle: strings.blocked.blacklistedSubtitle,
      textColor: "#fff",
    },
    pending: {
      bgColor: "#7C3AED",
      iconBg: "rgba(255,255,255,0.15)",
      icon: "clock" as const,
      title: strings.blocked.pendingTitle,
      subtitle: strings.blocked.pendingSubtitle,
      textColor: "#fff",
    },
    not_approved: {
      bgColor: "#1A1D2E",
      iconBg: "rgba(255,255,255,0.08)",
      icon: "lock" as const,
      title: strings.blocked.notApprovedTitle,
      subtitle: strings.blocked.notApprovedSubtitle,
      textColor: "#fff",
    },
    allowed: {
      bgColor: "#16A34A",
      iconBg: "rgba(255,255,255,0.15)",
      icon: "check-circle" as const,
      title: strings.states.allowed,
      subtitle: "",
      textColor: "#fff",
    },
  };

  const c = config[status];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: c.bgColor,
          paddingTop: insets.top + 24,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <View style={styles.inner}>
        <View style={[styles.iconCircle, { backgroundColor: c.iconBg }]}>
          <Feather name={c.icon} size={40} color={c.textColor} />
        </View>

        <Text style={[styles.statusLabel, { color: c.textColor, opacity: 0.7 }]}>
          {domain}
        </Text>

        <Text style={[styles.title, { color: c.textColor }]}>{c.title}</Text>

        <Text style={[styles.subtitle, { color: c.textColor, opacity: 0.85 }]}>
          {c.subtitle}
        </Text>

        {status === "blacklisted" && reason && (
          <View style={[styles.reasonBox, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
            <Text style={[styles.reasonLabel, { color: c.textColor, opacity: 0.7 }]}>
              {strings.blocked.blacklistedReason}
            </Text>
            <Text style={[styles.reasonText, { color: c.textColor }]}>
              {reason}
            </Text>
          </View>
        )}

        {status === "pending" && (
          <View style={[styles.reasonBox, { backgroundColor: "rgba(255,255,255,0.12)" }]}>
            <Text style={[styles.reasonText, { color: c.textColor, opacity: 0.85 }]}>
              {strings.blocked.pendingHint}
            </Text>
          </View>
        )}

        {status === "not_approved" && (
          <TouchableOpacity
            style={[styles.reportBtn, { backgroundColor: "#2563EB" }]}
            onPress={handleReport}
            activeOpacity={0.8}
          >
            <Feather name="flag" size={18} color="#fff" />
            <Text style={styles.reportBtnText}>
              {strings.actions.reportSafe}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[styles.backBtn, { backgroundColor: "rgba(255,255,255,0.15)" }]}
        onPress={onGoBack}
        activeOpacity={0.7}
      >
        <Feather name="arrow-left" size={18} color={c.textColor} />
        <Text style={[styles.backBtnText, { color: c.textColor }]}>
          {strings.actions.goBack}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 28,
    justifyContent: "space-between",
  },
  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 300,
  },
  reasonBox: {
    borderRadius: 12,
    padding: 16,
    gap: 4,
    width: "100%",
    marginTop: 8,
  },
  reasonLabel: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  reasonText: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 22,
  },
  reportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 8,
  },
  reportBtnText: {
    fontSize: 16,
    fontFamily: "Inter_600SemiBold",
    color: "#fff",
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  backBtnText: {
    fontSize: 16,
    fontFamily: "Inter_500Medium",
  },
});
