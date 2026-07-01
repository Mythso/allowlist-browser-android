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
  };
  states: {
    allowed: string;
    blacklisted: string;
    pending: string;
    notApproved: string;
  };
  actions: {
    reportSafe: string;
    removeFavorite: string;
    goBack: string;
    updateLists: string;
    exportFavorites: string;
    cancel: string;
    submit: string;
  };
  blocked: {
    blacklistedTitle: string;
    blacklistedSubtitle: string;
    blacklistedReason: string;
    reportWrongBlacklist: string;
    pendingTitle: string;
    pendingSubtitle: string;
    pendingHint: string;
    notApprovedTitle: string;
    notApprovedSubtitle: string;
    reportFormLabel: string;
    reportFormPlaceholder: string;
    reportSubmit: string;
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
    statsSection: string;
    allowlistCount: string;
    blacklistCount: string;
    pendingCount: string;
    reportSection: string;
    reportUrlLabel: string;
    reportUrlPlaceholder: string;
    reportReasonLabel: string;
    reportReasonPlaceholder: string;
    reportSubmitBtn: string;
    reportSuccess: string;
    myReportsSection: string;
    noReports: string;
    reportTypeLabels: {
      safe: string;
      wrong_blacklist: string;
      wrong_allowlist: string;
    };
    deleteReport: string;
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
  },
  states: {
    allowed: "Godkjent",
    blacklisted: "Blokkert",
    pending: "Venter på vurdering",
    notApproved: "Ikke godkjent",
  },
  actions: {
    reportSafe: "Rapporter som trygg",
    removeFavorite: "Fjern",
    goBack: "Tilbake",
    updateLists: "Oppdater lister",
    exportFavorites: "Eksporter favoritter",
    cancel: "Avbryt",
    submit: "Send inn",
  },
  blocked: {
    blacklistedTitle: "Blokkert",
    blacklistedSubtitle: "Denne nettsiden er svartelistet.",
    blacklistedReason: "Årsak",
    reportWrongBlacklist: "Rapporter feil – ikke burde vært blokkert",
    pendingTitle: "Venter på vurdering",
    pendingSubtitle: "Nettsiden er rapportert og venter på gjennomgang.",
    pendingHint: "Listene oppdateres jevnlig. Prøv igjen etter en oppdatering.",
    notApprovedTitle: "Ikke godkjent",
    notApprovedSubtitle: "Denne nettsiden er ikke på godkjenningslisten.",
    reportFormLabel: "Begrunn rapporten (valgfritt)",
    reportFormPlaceholder: "Hvorfor bør denne siden godkjennes / fjernes?",
    reportSubmit: "Send rapport",
    reportedMessage: "Rapport sendt. Vi vurderer nettsiden.",
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
    languageEnglish: "English",
    listsSection: "Lister",
    updateButton: "Oppdater lister nå",
    lastUpdated: "Sist oppdatert",
    never: "Aldri",
    updating: "Oppdaterer…",
    updateSuccess: "Lister oppdatert",
    updateFailed: "Kunne ikke hente lister. Sjekk URL-ene.",
    allowlistUrl: "URL – godkjenningsliste",
    blacklistUrl: "URL – svarteliste",
    csvUrlHint: "Raw GitHub-URL til CSV-filen",
    favoritesSection: "Favoritter",
    exportButton: "Eksporter favoritter",
    statsSection: "Status",
    allowlistCount: "Godkjente sider",
    blacklistCount: "Blokkerte sider",
    pendingCount: "Venter på vurdering",
    reportSection: "Rapporter en godkjent side",
    reportUrlLabel: "Nettadresse",
    reportUrlPlaceholder: "f.eks. nettsted.no",
    reportReasonLabel: "Hvorfor burde den ikke være godkjent?",
    reportReasonPlaceholder: "Beskriv problemet…",
    reportSubmitBtn: "Send rapport",
    reportSuccess: "Rapport sendt",
    myReportsSection: "Mine rapporter",
    noReports: "Ingen rapporter sendt",
    reportTypeLabels: {
      safe: "Rapportert som trygg",
      wrong_blacklist: "Rapportert feil blokkert",
      wrong_allowlist: "Rapportert feil godkjent",
    },
    deleteReport: "Slett",
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
  },
  states: {
    allowed: "Approved",
    blacklisted: "Blacklisted",
    pending: "Pending approval",
    notApproved: "Not approved",
  },
  actions: {
    reportSafe: "Report as Safe",
    removeFavorite: "Remove",
    goBack: "Back",
    updateLists: "Update Lists",
    exportFavorites: "Export Favorites",
    cancel: "Cancel",
    submit: "Submit",
  },
  blocked: {
    blacklistedTitle: "Blacklisted",
    blacklistedSubtitle: "This website has been blacklisted.",
    blacklistedReason: "Reason",
    reportWrongBlacklist: "Report error — should not be blocked",
    pendingTitle: "Pending Approval",
    pendingSubtitle: "This website has been reported and is awaiting review.",
    pendingHint: "Lists are updated regularly. Try again after an update.",
    notApprovedTitle: "Not Approved",
    notApprovedSubtitle: "This website is not on the allow list.",
    reportFormLabel: "Reason for report (optional)",
    reportFormPlaceholder: "Why should this site be approved / removed?",
    reportSubmit: "Submit report",
    reportedMessage: "Report submitted. We will review the website.",
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
    languageNorwegian: "Norsk",
    languageEnglish: "English",
    listsSection: "Lists",
    updateButton: "Update Lists Now",
    lastUpdated: "Last updated",
    never: "Never",
    updating: "Updating…",
    updateSuccess: "Lists updated",
    updateFailed: "Could not fetch lists. Check the URLs.",
    allowlistUrl: "Allow list URL",
    blacklistUrl: "Blacklist URL",
    csvUrlHint: "Raw GitHub URL to the CSV file",
    favoritesSection: "Favorites",
    exportButton: "Export Favorites",
    statsSection: "Status",
    allowlistCount: "Approved sites",
    blacklistCount: "Blocked sites",
    pendingCount: "Pending review",
    reportSection: "Report an approved site",
    reportUrlLabel: "Website address",
    reportUrlPlaceholder: "e.g. website.com",
    reportReasonLabel: "Why should it not be approved?",
    reportReasonPlaceholder: "Describe the issue…",
    reportSubmitBtn: "Submit report",
    reportSuccess: "Report submitted",
    myReportsSection: "My Reports",
    noReports: "No reports submitted",
    reportTypeLabels: {
      safe: "Reported as safe",
      wrong_blacklist: "Reported wrong block",
      wrong_allowlist: "Reported wrong approval",
    },
    deleteReport: "Delete",
  },
};

export const allStrings: Record<Language, Strings> = { no, en };
export default allStrings;
