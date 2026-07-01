import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { allStrings, Language, Strings } from "@/constants/strings";

export interface Favorite {
  id: string;
  domain: string;
  url: string;
  addedAt: number;
}

export type DomainStatus =
  | "allowed"
  | "blacklisted"
  | "pending"
  | "not_approved";

export interface DomainClassification {
  status: DomainStatus;
  reason?: string;
}

export type ReportType = "safe" | "wrong_blacklist" | "wrong_allowlist";

export interface UserReport {
  id: string;
  domain: string;
  type: ReportType;
  reason: string;
  timestamp: number;
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  strings: Strings;
  favorites: Favorite[];
  addFavorite: (url: string, domain: string) => void;
  removeFavorite: (domain: string) => void;
  isFavorite: (domain: string) => boolean;
  allowlist: Map<string, string>;
  blacklist: Map<string, string>;
  pendingList: Map<string, string>;
  classifyDomain: (domain: string) => DomainClassification;
  fetchLists: () => Promise<{ success: boolean; error?: string }>;
  isLoadingLists: boolean;
  lastUpdated: number | null;
  allowlistUrl: string;
  blacklistUrl: string;
  pendingCsvUrl: string;
  reportedCsvUrl: string;
  setAllowlistUrl: (url: string) => void;
  setBlacklistUrl: (url: string) => void;
  userReports: UserReport[];
  addReport: (domain: string, type: ReportType, reason: string) => void;
  clearReport: (id: string) => void;
  pendingNavigationUrl: string | null;
  setPendingNavigationUrl: (url: string | null) => void;
}

const STORAGE_KEYS = {
  LANGUAGE: "@ab_language",
  FAVORITES: "@ab_favorites",
  ALLOWLIST_CACHE: "@ab_allowlist_cache",
  BLACKLIST_CACHE: "@ab_blacklist_cache",
  PENDING_CACHE: "@ab_pending_cache",
  LAST_UPDATED: "@ab_last_updated",
  ALLOWLIST_URL: "@ab_allowlist_url",
  BLACKLIST_URL: "@ab_blacklist_url",
  USER_REPORTS: "@ab_user_reports",
};

const REPO_BASE =
  "https://raw.githubusercontent.com/Mythso/allowlist-browser-android/main";

const DEFAULT_ALLOWLIST_URL = `${REPO_BASE}/allowlist.csv`;
const DEFAULT_BLACKLIST_URL = `${REPO_BASE}/blacklist.csv`;
const DEFAULT_PENDING_URL = `${REPO_BASE}/pending.csv`;
const DEFAULT_REPORTED_URL = `${REPO_BASE}/reported.csv`;

const BUILTIN_ALLOWLIST: Array<{ domain: string; reason: string }> = [
  { domain: "duckduckgo.com", reason: "Standard søkemotor" },
  { domain: "wikipedia.org", reason: "Encyklopedi" },
];

function parseCsv(csv: string): Array<{ domain: string; reason: string }> {
  const lines = csv.trim().split("\n");
  const result: Array<{ domain: string; reason: string }> = [];
  const start =
    lines.length > 0 && lines[0].toLowerCase().includes("domain") ? 1 : 0;
  for (let i = start; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const commaIdx = line.indexOf(",");
    if (commaIdx === -1) continue;
    const domain = line
      .slice(0, commaIdx)
      .trim()
      .toLowerCase()
      .replace(/^www\./, "");
    let reason = line.slice(commaIdx + 1).trim();
    if (reason.startsWith('"') && reason.endsWith('"')) {
      reason = reason.slice(1, -1);
    }
    if (domain) result.push({ domain, reason });
  }
  return result;
}

async function safeFetch(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (res.ok) return await res.text();
    return null;
  } catch {
    return null;
  }
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("no");
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [allowlist, setAllowlist] = useState<Map<string, string>>(
    new Map(BUILTIN_ALLOWLIST.map(({ domain, reason }) => [domain, reason]))
  );
  const [blacklist, setBlacklist] = useState<Map<string, string>>(new Map());
  const [pendingList, setPendingList] = useState<Map<string, string>>(
    new Map()
  );
  const [isLoadingLists, setIsLoadingLists] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [allowlistUrl, setAllowlistUrlState] = useState(DEFAULT_ALLOWLIST_URL);
  const [blacklistUrl, setBlacklistUrlState] = useState(DEFAULT_BLACKLIST_URL);
  const [userReports, setUserReports] = useState<UserReport[]>([]);
  const [pendingNavigationUrl, setPendingNavigationUrl] = useState<
    string | null
  >(null);

  const strings = allStrings[language];

  useEffect(() => {
    (async () => {
      try {
        const [
          savedLang,
          savedFavorites,
          savedAllowlist,
          savedBlacklist,
          savedPending,
          savedLastUpdated,
          savedAllowlistUrl,
          savedBlacklistUrl,
          savedReports,
        ] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
          AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
          AsyncStorage.getItem(STORAGE_KEYS.ALLOWLIST_CACHE),
          AsyncStorage.getItem(STORAGE_KEYS.BLACKLIST_CACHE),
          AsyncStorage.getItem(STORAGE_KEYS.PENDING_CACHE),
          AsyncStorage.getItem(STORAGE_KEYS.LAST_UPDATED),
          AsyncStorage.getItem(STORAGE_KEYS.ALLOWLIST_URL),
          AsyncStorage.getItem(STORAGE_KEYS.BLACKLIST_URL),
          AsyncStorage.getItem(STORAGE_KEYS.USER_REPORTS),
        ]);

        if (savedLang) setLanguageState(savedLang as Language);
        if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
        if (savedLastUpdated) setLastUpdated(Number(savedLastUpdated));
        if (
          savedAllowlistUrl &&
          !savedAllowlistUrl.includes("YOURUSERNAME")
        )
          setAllowlistUrlState(savedAllowlistUrl);
        if (
          savedBlacklistUrl &&
          !savedBlacklistUrl.includes("YOURUSERNAME")
        )
          setBlacklistUrlState(savedBlacklistUrl);
        if (savedReports) setUserReports(JSON.parse(savedReports));

        if (savedAllowlist) {
          const entries = JSON.parse(savedAllowlist) as Array<[string, string]>;
          const merged = new Map<string, string>(
            BUILTIN_ALLOWLIST.map(({ domain, reason }) => [domain, reason])
          );
          entries.forEach(([k, v]) => merged.set(k, v));
          setAllowlist(merged);
        }
        if (savedBlacklist) {
          setBlacklist(
            new Map(JSON.parse(savedBlacklist) as Array<[string, string]>)
          );
        }
        if (savedPending) {
          setPendingList(
            new Map(JSON.parse(savedPending) as Array<[string, string]>)
          );
        }
      } catch {}
    })();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  }, []);

  const addFavorite = useCallback((url: string, domain: string) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.domain === domain)) return prev;
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const next = [{ id, domain, url, addedAt: Date.now() }, ...prev];
      AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next)).catch(
        () => {}
      );
      return next;
    });
  }, []);

  const removeFavorite = useCallback((domain: string) => {
    setFavorites((prev) => {
      const next = prev.filter((f) => f.domain !== domain);
      AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(next)).catch(
        () => {}
      );
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (domain: string) => favorites.some((f) => f.domain === domain),
    [favorites]
  );

  const addReport = useCallback(
    (domain: string, type: ReportType, reason: string) => {
      const report: UserReport = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        domain,
        type,
        reason,
        timestamp: Date.now(),
      };
      setUserReports((prev) => {
        const next = [report, ...prev];
        AsyncStorage.setItem(
          STORAGE_KEYS.USER_REPORTS,
          JSON.stringify(next)
        ).catch(() => {});
        return next;
      });
    },
    []
  );

  const clearReport = useCallback((id: string) => {
    setUserReports((prev) => {
      const next = prev.filter((r) => r.id !== id);
      AsyncStorage.setItem(
        STORAGE_KEYS.USER_REPORTS,
        JSON.stringify(next)
      ).catch(() => {});
      return next;
    });
  }, []);

  const classifyDomain = useCallback(
    (domain: string): DomainClassification => {
      const normalized = domain.toLowerCase().replace(/^www\./, "");
      if (blacklist.has(normalized)) {
        return { status: "blacklisted", reason: blacklist.get(normalized) };
      }
      if (allowlist.has(normalized)) {
        return { status: "allowed", reason: allowlist.get(normalized) };
      }
      if (pendingList.has(normalized)) {
        return { status: "pending", reason: pendingList.get(normalized) };
      }
      const localPending = userReports.find(
        (r) => r.domain === normalized && r.type === "safe"
      );
      if (localPending) {
        return { status: "pending", reason: localPending.reason };
      }
      return { status: "not_approved" };
    },
    [allowlist, blacklist, pendingList, userReports]
  );

  const fetchLists = useCallback(async () => {
    setIsLoadingLists(true);
    let anySuccess = false;
    try {
      const [allowText, blackText, pendingText] = await Promise.all([
        safeFetch(allowlistUrl),
        safeFetch(blacklistUrl),
        safeFetch(DEFAULT_PENDING_URL),
      ]);

      if (allowText !== null) {
        const entries = parseCsv(allowText);
        const map = new Map<string, string>(
          BUILTIN_ALLOWLIST.map(({ domain, reason }) => [domain, reason])
        );
        entries.forEach(({ domain, reason }) => map.set(domain, reason));
        setAllowlist(map);
        await AsyncStorage.setItem(
          STORAGE_KEYS.ALLOWLIST_CACHE,
          JSON.stringify(Array.from(map.entries()))
        );
        anySuccess = true;
      }

      if (blackText !== null) {
        const entries = parseCsv(blackText);
        const map = new Map<string, string>(
          entries.map(({ domain, reason }) => [domain, reason])
        );
        setBlacklist(map);
        await AsyncStorage.setItem(
          STORAGE_KEYS.BLACKLIST_CACHE,
          JSON.stringify(Array.from(map.entries()))
        );
        anySuccess = true;
      }

      if (pendingText !== null) {
        const entries = parseCsv(pendingText);
        const map = new Map<string, string>(
          entries.map(({ domain, reason }) => [domain, reason])
        );
        setPendingList(map);
        await AsyncStorage.setItem(
          STORAGE_KEYS.PENDING_CACHE,
          JSON.stringify(Array.from(map.entries()))
        );
      }

      if (anySuccess) {
        const now = Date.now();
        setLastUpdated(now);
        await AsyncStorage.setItem(STORAGE_KEYS.LAST_UPDATED, String(now));
      }
    } catch {}
    setIsLoadingLists(false);
    return {
      success: anySuccess,
      error: anySuccess ? undefined : "Kunne ikke hente lister",
    };
  }, [allowlistUrl, blacklistUrl]);

  const setAllowlistUrl = useCallback((url: string) => {
    setAllowlistUrlState(url);
    AsyncStorage.setItem(STORAGE_KEYS.ALLOWLIST_URL, url).catch(() => {});
  }, []);

  const setBlacklistUrl = useCallback((url: string) => {
    setBlacklistUrlState(url);
    AsyncStorage.setItem(STORAGE_KEYS.BLACKLIST_URL, url).catch(() => {});
  }, []);

  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        strings,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        allowlist,
        blacklist,
        pendingList,
        classifyDomain,
        fetchLists,
        isLoadingLists,
        lastUpdated,
        allowlistUrl,
        blacklistUrl,
        pendingCsvUrl: DEFAULT_PENDING_URL,
        reportedCsvUrl: DEFAULT_REPORTED_URL,
        setAllowlistUrl,
        setBlacklistUrl,
        userReports,
        addReport,
        clearReport,
        pendingNavigationUrl,
        setPendingNavigationUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
}
