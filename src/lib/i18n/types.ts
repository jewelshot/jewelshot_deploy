/**
 * i18n Type Definitions
 */

export type Language = 'en' | 'tr';

export interface TranslationKeys {
  // Common
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    close: string;
    confirm: string;
    back: string;
    next: string;
    previous: string;
    submit: string;
    search: string;
    filter: string;
    clear: string;
    apply: string;
    reset: string;
    download: string;
    upload: string;
    copy: string;
    share: string;
    view: string;
    more: string;
    less: string;
    all: string;
    none: string;
    yes: string;
    no: string;
    or: string;
    and: string;
  };

  // Navigation
  nav: {
    home: string;
    studio: string;
    gallery: string;
    library: string;
    batch: string;
    profile: string;
    settings: string;
    help: string;
    logout: string;
    login: string;
    signup: string;
  };

  // Studio
  studio: {
    title: string;
    uploadImage: string;
    dropImage: string;
    supportedFormats: string;
    maxFileSize: string;
    generate: string;
    generating: string;
    selectPreset: string;
    quickPresets: string;
    selectivePresets: string;
    advancedPresets: string;
    generationSettings: string;
    jewelryType: string;
    gender: string;
    aspectRatio: string;
    faceVisibility: string;
    showFace: string;
    hideFace: string;
    style: string;
    model: string;
    setting: string;
    mood: string;
    random: string;
    applyToAll: string;
    settingsComplete: string;
    settingsIncomplete: string;
    configureSettings: string;
  };

  // Jewelry Types
  jewelry: {
    ring: string;
    necklace: string;
    earring: string;
    bracelet: string;
    all: string;
  };

  // Gender
  gender: {
    women: string;
    men: string;
    unisex: string;
  };

  // AI Processing
  ai: {
    processing: string;
    processingVia: string;
    initializing: string;
    queued: string;
    aiProcessing: string;
    preparing: string;
    complete: string;
    failed: string;
    tryAgain: string;
    estimatedTime: string;
  };

  // Gallery
  gallery: {
    title: string;
    noImages: string;
    selectAll: string;
    deselectAll: string;
    deleteSelected: string;
    downloadSelected: string;
    emptyGallery: string;
    startCreating: string;
  };

  // Library
  library: {
    title: string;
    presetLibrary: string;
    searchPresets: string;
    categories: string;
    allCategories: string;
    noResults: string;
    usePreset: string;
  };

  // Profile
  profile: {
    title: string;
    account: string;
    email: string;
    name: string;
    plan: string;
    credits: string;
    creditsRemaining: string;
    language: string;
    selectLanguage: string;
    theme: string;
    darkMode: string;
    lightMode: string;
    notifications: string;
    security: string;
    changePassword: string;
    twoFactor: string;
    deleteAccount: string;
    signOut: string;
  };

  // Auth
  auth: {
    login: string;
    signup: string;
    logout: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    resetPassword: string;
    rememberMe: string;
    createAccount: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    orContinueWith: string;
    termsAgree: string;
    verifyEmail: string;
    checkEmail: string;
  };

  // Errors
  errors: {
    generic: string;
    network: string;
    unauthorized: string;
    notFound: string;
    serverError: string;
    uploadFailed: string;
    processingFailed: string;
    invalidFile: string;
    fileTooLarge: string;
    sessionExpired: string;
  };

  // Success Messages
  success: {
    saved: string;
    deleted: string;
    uploaded: string;
    downloaded: string;
    copied: string;
    generated: string;
    updated: string;
  };

  // Tooltips
  tooltips: {
    zoom: string;
    pan: string;
    reset: string;
    undo: string;
    redo: string;
    brush: string;
    eraser: string;
    download: string;
    share: string;
  };

  // Settings Modal
  settingsModal: {
    title: string;
    subtitle: string;
    requiredWarning: string;
    gender: string;
    jewelryType: string;
    aspectRatio: string;
    faceVisibility: string;
    showFace: string;
    hideFace: string;
    showFaceDesc: string;
    hideFaceDesc: string;
    vertical: string;
    horizontal: string;
    applyToAll: string;
    saveSettings: string;
    story: string;
    standard: string;
    classic: string;
    portrait: string;
    square: string;
    landscape: string;
    ultrawide: string;
  };

  // Right Sidebar
  rightSidebar: {
    aiGeneration: string;
    settings: string;
    settingsComplete: string;
    configureSettings: string;
    browseLibrary: string;
    mostUsed: string;
  };

  // Preset Modes
  presets: {
    quick: string;
    selective: string;
    advanced: string;
    random: string;
    generate: string;
    style: string;
    model: string;
    setting: string;
    mood: string;
    camera: string;
    lighting: string;
    colorGrading: string;
    hair: string;
    nails: string;
    makeup: string;
    skinTone: string;
    facialHair: string;
  };

  // Dashboard
  dashboard: {
    title: string;
    welcome: string;
    recentActivity: string;
    quickActions: string;
    startCreating: string;
    viewGallery: string;
    openStudio: string;
  };

  // Batch
  batch: {
    title: string;
    uploadImages: string;
    processAll: string;
    downloading: string;
    processing: string;
    completed: string;
    failed: string;
    pending: string;
    selectPreset: string;
    dragDropImages: string;
    orClickToUpload: string;
    imagesSelected: string;
    clearAll: string;
    downloadAll: string;
  };

  // Confirmation
  confirm: {
    deleteTitle: string;
    deleteMessage: string;
    deleteConfirm: string;
    cancelAction: string;
    unsavedChanges: string;
    leavePageMessage: string;
    stay: string;
    leave: string;
  };

  // Empty States
  empty: {
    noImages: string;
    noPresets: string;
    noResults: string;
    startByUploading: string;
    tryDifferentSearch: string;
  };

  // Time
  time: {
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    seconds: string;
    minutes: string;
  };
}

export type Translations = {
  [key in Language]: TranslationKeys;
};
