import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import type { WebViewNavigation } from "react-native-webview/lib/WebViewTypes";

import BlockedScreen from "@/components/BlockedScreen";
import BrowserBar from "@/components/BrowserBar";
import StartPage from "@/components/StartPage";
import StatusBanner from "@/components/StatusBanner";
import { DomainStatus, useAppContext } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type BrowserState = "start" | "browsing" | "blocked";

interface BlockedInfo {
  domain: string;
  status: DomainStatus;
  reason?: string;
}

function extractDomain(url: string): string {
  try {
    const withProtocol = url.startsWith("http") ? url : `https://${url}`;
    const parsed = new URL(withProtocol);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function processInput(input: string): string {
  const trimmed = input.trim();
  const urlPattern =
    /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?(\?.*)?$/;
  if (urlPattern.test(trimmed)) {
    return trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
  }
  return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`;
}

export default function HomeScreen() {
  const { classifyDomain, addFavorite, isFavorite, pendingNavigationUrl, setPendingNavigationUrl } =
    useAppContext();
  const colors = useColors();

  const webViewRef = useRef<WebView>(null);
  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [browserState, setBrowserState] = useState<BrowserState>("start");
  const [currentUrl, setCurrentUrl] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [blockedInfo, setBlockedInfo] = useState<BlockedInfo | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerReason, setBannerReason] = useState<string | undefined>(undefined);
  const [currentDomain, setCurrentDomain] = useState("");

  const showApprovedBanner = useCallback((reason?: string) => {
    if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
    setBannerReason(reason);
    setShowBanner(true);
  }, []);

  const dismissBanner = useCallback(() => {
    setShowBanner(false);
  }, []);

  const navigate = useCallback(
    (input: string) => {
      const url = processInput(input);
      const domain = extractDomain(url);
      const classification = classifyDomain(domain);

      setInputValue(url);

      if (classification.status === "allowed") {
        setCurrentUrl(url);
        setCurrentDomain(domain);
        setBrowserState("browsing");
        showApprovedBanner(classification.reason);
      } else {
        setBlockedInfo({ domain, status: classification.status, reason: classification.reason });
        setBrowserState("blocked");
      }
    },
    [classifyDomain, showApprovedBanner]
  );

  useEffect(() => {
    if (pendingNavigationUrl) {
      navigate(pendingNavigationUrl);
      setPendingNavigationUrl(null);
    }
  }, [pendingNavigationUrl]);

  const handleShouldStartLoad = useCallback(
    (request: WebViewNavigation): boolean => {
      const { url } = request;
      if (
        url.startsWith("about:") ||
        url.startsWith("data:") ||
        url === "about:blank"
      ) {
        return true;
      }

      const domain = extractDomain(url);
      const classification = classifyDomain(domain);

      if (classification.status === "allowed") {
        if (domain !== currentDomain) {
          setCurrentDomain(domain);
          showApprovedBanner(classification.reason);
        }
        setInputValue(url);
        return true;
      }

      setBlockedInfo({
        domain,
        status: classification.status,
        reason: classification.reason,
      });
      setBrowserState("blocked");
      return false;
    },
    [classifyDomain, currentDomain, showApprovedBanner]
  );

  const handleNavigationStateChange = useCallback(
    (navState: WebViewNavigation) => {
      setCanGoBack(navState.canGoBack);
      setCanGoForward(navState.canGoForward);
      if (navState.url && !navState.url.startsWith("about:")) {
        setInputValue(navState.url);
      }
    },
    []
  );

  const handleGoHome = useCallback(() => {
    setBrowserState("start");
    setInputValue("");
    setShowBanner(false);
  }, []);

  const handleGoBackFromBlocked = useCallback(() => {
    if (currentUrl) {
      setBrowserState("browsing");
    } else {
      setBrowserState("start");
    }
  }, [currentUrl]);

  const handleAddFavorite = useCallback(() => {
    if (currentUrl && currentDomain) {
      addFavorite(currentUrl, currentDomain);
    }
  }, [currentUrl, currentDomain, addFavorite]);

  const isBrowsing = browserState === "browsing";
  const isStart = browserState === "start";
  const isBlocked = browserState === "blocked";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {!isStart && (
        <BrowserBar
          value={inputValue}
          onChangeText={setInputValue}
          onSubmit={() => navigate(inputValue)}
          canGoBack={canGoBack}
          canGoForward={canGoForward}
          isLoading={isLoading}
          onGoBack={() => webViewRef.current?.goBack()}
          onGoForward={() => webViewRef.current?.goForward()}
          onRefresh={() => webViewRef.current?.reload()}
          onGoHome={handleGoHome}
          showFavorite={isBrowsing}
          isFavorite={isFavorite(currentDomain)}
          onFavorite={handleAddFavorite}
        />
      )}

      {isStart && <StartPage onNavigate={navigate} />}

      {isBlocked && blockedInfo && (
        <BlockedScreen
          domain={blockedInfo.domain}
          status={blockedInfo.status}
          reason={blockedInfo.reason}
          onGoBack={handleGoBackFromBlocked}
          onReport={() => {
            setBrowserState(currentUrl ? "browsing" : "start");
          }}
        />
      )}

      <View
        style={[
          styles.webViewWrapper,
          { display: isBrowsing && currentUrl ? "flex" : "none" },
        ]}
      >
        {showBanner && (
          <StatusBanner
            reason={bannerReason}
            onDismiss={dismissBanner}
          />
        )}
        {Platform.OS !== "web" ? (
          <WebView
            ref={webViewRef}
            source={{ uri: currentUrl }}
            style={styles.webView}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            onNavigationStateChange={handleNavigationStateChange}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
          />
        ) : (
          <View style={[styles.webPlaceholder, { backgroundColor: colors.muted }]} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webViewWrapper: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  webPlaceholder: {
    flex: 1,
  },
});
