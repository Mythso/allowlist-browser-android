export type Language = "no" | "en";

export interface Strings {
  tabs: {
    home: string;
    favorites: string;
    settings: string;
  };
  home: {
    startTitle: string;
    searchPlaceholder: string;
    quickAccess: string;
    noFavorites: string;
    noFavoritesHint: string;
  };
  states: {
    allowed: string;
    allowedTap: string;
    blacklisted: string;
    pending: string;
    notApproved: string;
  };
  actions: {
    reportSafe: string;
    addFavorite: string;
    removeFavorite: string;
    goBack: string;
    refresh: string;
    updateLists: string;
    exportFavorites: string;
    copy: string;
    ok: string;
    cancel: string;
  };
  blocked: {
    blacklistedTitle: string;
    blacklistedSubtitle: string;
    blacklistedReason: string;
    pendingTitle: string;
    pendingSubtitle: string;
    pendingHint: string;
    notApprovedTitle: string;
    notApprovedSubtitle: string;
    reportedMessage: string;
  };
  favorites: {
    title: string;
    empty: string;
    emptyHint: string;
    exportTitle: string;
    exportDone: string;
  };
  settings: {
    title: string;
    languageSection: string;
    languageNorwegian: string;
    languageEnglish: string;
    listsSection: string;
    updateButton: string;
    lastUpdated: string;
    never: string;
    updating: string;
    updateSuccess: string;
    updateFailed: string;
    allowlistUrl: string;
    blacklistUrl: string;
    csvUrlHint: string;
    favoritesSection: string;
    exportButton: string;
    aboutSection: string;
    allowlistCount: string;
    blacklistCount: string;
    pendingCount: string;
  };
}

const no: Strings = {
  tabs: {
    home: "Hjem",
    favorites: "Favoritter",
    settings: "Innstillinger",
  },
  home: {
    startTitle: "Startside",
    searchPlaceholder: "Søk eller skriv inn adresse",
    quickAccess: "Hurtigtilgang",
    noFavorites: "Ingen favoritter ennå",
    noFavoritesHint: "Besøk en godkjent nettside og trykk på stjerneikonet for å legge til.",
  },
  states: {
    allowed: "Godkjent",
    allowedTap: "Trykk for å se begrunnelse",
    blacklisted: "Blokkert",
    pending: "Venter på vurdering",
    notApproved: "Ikke godkjent",
  },
  actions: {
    reportSafe: "Rapporter som trygg",
    addFavorite: "Legg til i favoritter",
    removeFavorite: "Fjern fra favoritter",
    goBack: "Gå tilbake",
    refresh: "Oppdater",
    updateLists: "Oppdater lister",
    exportFavorites: "Eksporter favoritter",
    copy: "Kopier",
    ok: "OK",
    cancel: "Avbryt",
  },
  blocked: {
    blacklistedTitle: "Blokkert",
    blacklistedSubtitle: "Denne nettsiden er svartelistet",
    blacklistedReason: "Begrunnelse",
    pendingTitle: "Venter på vurdering",
    pendingSubtitle: "Denne nettsiden er rapportert og venter på godkjenning.",
    pendingHint: "Listen oppdateres jevnlig. Du kan prøve igjen etter en oppdatering.",
    notApprovedTitle: "Ikke godkjent",
    notApprovedSubtitle: "Denne nettsiden er ikke på godkjenningslisten.",
    reportedMessage: "Nettsiden er rapportert som trygg og venter på vurdering.",
  },
  favorites: {
    title: "Favoritter",
    empty: "Ingen favoritter ennå",
    emptyHint: "Besøk en godkjent nettside og trykk på stjernen for å lagre den her.",
    exportTitle: "Eksporterte favoritter",
    exportDone: "Kopiert til utklippstavlen",
  },
  settings: {
    title: "Innstillinger",
    languageSection: "Språk",
    languageNorwegian: "Norsk",
    languageEnglish: "Engelsk",
    listsSection: "Godkjenningslister",
    updateButton: "Oppdater lister nå",
    lastUpdated: "Sist oppdatert",
    never: "Aldri",
    updating: "Oppdaterer...",
    updateSuccess: "Lister oppdatert",
    updateFailed: "Oppdatering mislyktes",
    allowlistUrl: "URL til godkjenningsliste (CSV)",
    blacklistUrl: "URL til svarteliste (CSV)",
    csvUrlHint: "Raw GitHub URL til CSV-filen",
    favoritesSection: "Favoritter",
    exportButton: "Eksporter favoritter",
    aboutSection: "Oversikt",
    allowlistCount: "Godkjente nettsider",
    blacklistCount: "Svartelistede nettsider",
    pendingCount: "Venter på vurdering",
  },
};

const en: Strings = {
  tabs: {
    home: "Home",
    favorites: "Favorites",
    settings: "Settings",
  },
  home: {
    startTitle: "Start Page",
    searchPlaceholder: "Search or enter address",
    quickAccess: "Quick Access",
    noFavorites: "No favorites yet",
    noFavoritesHint: "Visit an approved site and tap the star icon to add it.",
  },
  states: {
    allowed: "Approved",
    allowedTap: "Tap for reason",
    blacklisted: "Blacklisted",
    pending: "Pending approval",
    notApproved: "Not on Allow List",
  },
  actions: {
    reportSafe: "Report as Safe",
    addFavorite: "Add to Favorites",
    removeFavorite: "Remove from Favorites",
    goBack: "Go Back",
    refresh: "Refresh",
    updateLists: "Update Lists",
    exportFavorites: "Export Favorites",
    copy: "Copy",
    ok: "OK",
    cancel: "Cancel",
  },
  blocked: {
    blacklistedTitle: "Blacklisted",
    blacklistedSubtitle: "This website has been blacklisted",
    blacklistedReason: "Reason",
    pendingTitle: "Pending Approval",
    pendingSubtitle: "This website has been reported and is awaiting approval.",
    pendingHint: "The list is updated regularly. You can try again after an update.",
    notApprovedTitle: "Not Approved",
    notApprovedSubtitle: "This website is not on the allow list.",
    reportedMessage: "The website has been reported as safe and is pending review.",
  },
  favorites: {
    title: "Favorites",
    empty: "No favorites yet",
    emptyHint: "Visit an approved site and tap the star to save it here.",
    exportTitle: "Exported Favorites",
    exportDone: "Copied to clipboard",
  },
  settings: {
    title: "Settings",
    languageSection: "Language",
    languageNorwegian: "Norwegian",
    languageEnglish: "English",
    listsSection: "Allow Lists",
    updateButton: "Update Lists Now",
    lastUpdated: "Last updated",
    never: "Never",
    updating: "Updating...",
    updateSuccess: "Lists updated",
    updateFailed: "Update failed",
    allowlistUrl: "Allow List URL (CSV)",
    blacklistUrl: "Blacklist URL (CSV)",
    csvUrlHint: "Raw GitHub URL to the CSV file",
    favoritesSection: "Favorites",
    exportButton: "Export Favorites",
    aboutSection: "Overview",
    allowlistCount: "Approved sites",
    blacklistCount: "Blacklisted sites",
    pendingCount: "Pending review",
  },
};

export const allStrings: Record<Language, Strings> = { no, en };
export default allStrings;
