import React, { useCallback, useEffect, useRef, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import type { WebViewNavigation } from "react-native-webview/lib/WebViewTypes";

import BlockedScreen from "@/components/BlockedScreen";
import BrowserBar from "@/components/BrowserBar";
import StartPage from "@/components/StartPage";
import { DomainStatus, useAppContext } from "@/context/AppContext";
import { useColors } from "@/hooks/useColors";

type BrowserState = "start" | "browsing" | "blocked";

interface BlockedInfo {
  domain: string;
  status: DomainStatus;
  reason?: string;
}

// Combined UI state to avoid race conditions between status + info updates
interface UIState {
  browser: BrowserState;
  blocked: BlockedInfo | null;
}

function extractDomain(url: string): string {
  try {
    const withProto = url.startsWith("http") ? url : `https://${url}`;
    return new URL(withProto).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function processInput(input: string): string {
  const t = input.trim();
  const urlRe = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?(\?.*)?$/;
  if (urlRe.test(t)) return t.startsWith("http") ? t : `https://${t}`;
  return `https://duckduckgo.com/?q=${encodeURIComponent(t)}`;
}

export default function HomeScreen() {
  const { classifyDomain, addFavorite, isFavorite, pendingNavigationUrl, setPendingNavigationUrl } =
    useAppContext();
  const colors = useColors();
  const webViewRef = useRef<WebView>(null);

  const [ui, setUI] = useState<UIState>({ browser: "start", blocked: null });
  const [currentUrl, setCurrentUrl] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDomain, setCurrentDomain] = useState("");

  // Handle navigate-from-favorites
  useEffect(() => {
    if (pendingNavigationUrl) {
      navigate(pendingNavigationUrl);
      setPendingNavigationUrl(null);
    }
  }, [pendingNavigationUrl]);

  const navigate = useCallback(
    (input: string) => {
      const url = processInput(input);
      const domain = extractDomain(url);
      const cls = classifyDomain(domain);

      setInputValue(url);

      if (cls.status === "allowed") {
        setCurrentUrl(url);
        setCurrentDomain(domain);
        setUI({ browser: "browsing", blocked: null });
      } else {
        setUI({
          browser: "blocked",
          blocked: { domain, status: cls.status, reason: cls.reason },
        });
      }
    },
    [classifyDomain]
  );

  // Called by WebView for every main-frame navigation attempt
  const handleShouldStartLoad = useCallback(
    (request: WebViewNavigation): boolean => {
      const { url } = request;
      if (url.startsWith("about:") || url.startsWith("data:")) return true;

      const domain = extractDomain(url);
      const cls = classifyDomain(domain);

      if (cls.status === "allowed") {
        setCurrentDomain(domain);
        setInputValue(url);
        return true;
      }

      // Blocked — update both pieces of state atomically
      setUI({
        browser: "blocked",
        blocked: { domain, status: cls.status, reason: cls.reason },
      });
      return false;
    },
    [classifyDomain]
  );

  const handleNavStateChange = useCallback((nav: WebViewNavigation) => {
    setCanGoBack(nav.canGoBack);
    setCanGoForward(nav.canGoForward);
    if (nav.url && !nav.url.startsWith("about:")) setInputValue(nav.url);
  }, []);

  const handleGoHome = useCallback(() => {
    setUI({ browser: "start", blocked: null });
    setInputValue("");
  }, []);

  const handleGoBackFromBlocked = useCallback(() => {
    if (currentUrl) {
      setUI({ browser: "browsing", blocked: null });
    } else {
      setUI({ browser: "start", blocked: null });
    }
  }, [currentUrl]);

  const handleFavorite = useCallback(() => {
    if (currentUrl && currentDomain) addFavorite(currentUrl, currentDomain);
  }, [currentUrl, currentDomain, addFavorite]);

  const isBrowsing = ui.browser === "browsing";
  const isStart = ui.browser === "start";
  const isBlocked = ui.browser === "blocked";

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Browser bar — hidden on start page */}
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
          onFavorite={handleFavorite}
        />
      )}

      {/* Start page */}
      {isStart && <StartPage onNavigate={navigate} />}

      {/* Blocked screen — always rendered when blocked, even if info isn't set yet */}
      {isBlocked && (
        <BlockedScreen
          domain={ui.blocked?.domain ?? ""}
          status={ui.blocked?.status ?? "not_approved"}
          reason={ui.blocked?.reason}
          onGoBack={handleGoBackFromBlocked}
        />
      )}

      {/* WebView — kept mounted but hidden so page state survives blocked→browsing transitions */}
      <View
        style={[
          styles.webViewWrapper,
          { display: isBrowsing && currentUrl ? "flex" : "none" },
        ]}
      >
        {Platform.OS !== "web" ? (
          <WebView
            ref={webViewRef}
            source={{ uri: currentUrl }}
            style={styles.webView}
            onShouldStartLoadWithRequest={handleShouldStartLoad}
            onNavigationStateChange={handleNavStateChange}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
          />
        ) : (
          <View
            style={[styles.webPlaceholder, { backgroundColor: colors.muted }]}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  webViewWrapper: { flex: 1 },
  webView: { flex: 1 },
  webPlaceholder: { flex: 1 },
});
