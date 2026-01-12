/**
 * English Translations
 */

import { TranslationKeys } from '../types';

export const en: TranslationKeys = {
  // Common
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    search: 'Search',
    filter: 'Filter',
    clear: 'Clear',
    apply: 'Apply',
    reset: 'Reset',
    download: 'Download',
    upload: 'Upload',
    copy: 'Copy',
    share: 'Share',
    view: 'View',
    more: 'More',
    less: 'Less',
    all: 'All',
    none: 'None',
    yes: 'Yes',
    no: 'No',
    or: 'or',
    and: 'and',
  },

  // Navigation
  nav: {
    home: 'Home',
    studio: 'Studio',
    gallery: 'Gallery',
    library: 'Library',
    batch: 'Batch',
    profile: 'Profile',
    settings: 'Settings',
    help: 'Help',
    logout: 'Log Out',
    login: 'Log In',
    signup: 'Sign Up',
  },

  // Studio
  studio: {
    title: 'AI Jewelry Studio',
    uploadImage: 'Upload Image',
    dropImage: 'Drop your jewelry image here',
    supportedFormats: 'Supported formats: JPG, PNG, WebP',
    maxFileSize: 'Max file size: 10MB',
    generate: 'Generate',
    generating: 'Generating...',
    selectPreset: 'Select Preset',
    quickPresets: 'Quick Presets',
    selectivePresets: 'Selective',
    advancedPresets: 'Advanced',
    generationSettings: 'Generation Settings',
    jewelryType: 'Jewelry Type',
    gender: 'Gender',
    aspectRatio: 'Aspect Ratio',
    faceVisibility: 'Model Face',
    showFace: 'Show Face',
    hideFace: 'Hide Face',
    style: 'Style',
    model: 'Model',
    setting: 'Setting',
    mood: 'Mood',
    random: 'Random',
    applyToAll: 'Apply to All',
    settingsComplete: 'Settings Complete',
    settingsIncomplete: 'Configure Settings',
    configureSettings: 'Configure generation settings',
  },

  // Jewelry Types
  jewelry: {
    ring: 'Ring',
    necklace: 'Necklace',
    earring: 'Earring',
    bracelet: 'Bracelet',
    all: 'All Jewelry',
  },

  // Gender
  gender: {
    women: 'Women',
    men: 'Men',
    unisex: 'Unisex',
  },

  // AI Processing
  ai: {
    processing: 'Processing...',
    processingVia: 'Processing via',
    initializing: 'Initializing...',
    queued: 'Queued',
    aiProcessing: 'AI Processing',
    preparing: 'Preparing...',
    complete: 'Complete',
    failed: 'Failed',
    tryAgain: 'Try Again',
    estimatedTime: 'Estimated time',
  },

  // Gallery
  gallery: {
    title: 'My Gallery',
    noImages: 'No images yet',
    selectAll: 'Select All',
    deselectAll: 'Deselect All',
    deleteSelected: 'Delete Selected',
    downloadSelected: 'Download Selected',
    emptyGallery: 'Your gallery is empty',
    startCreating: 'Start creating in Studio',
  },

  // Library
  library: {
    title: 'Preset Library',
    presetLibrary: 'Preset Library',
    searchPresets: 'Search presets...',
    categories: 'Categories',
    allCategories: 'All Categories',
    noResults: 'No presets found',
    usePreset: 'Use Preset',
  },

  // Profile
  profile: {
    title: 'Profile',
    account: 'Account',
    email: 'Email',
    name: 'Name',
    plan: 'Plan',
    credits: 'Credits',
    creditsRemaining: 'credits remaining',
    language: 'Language',
    selectLanguage: 'Select Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    notifications: 'Notifications',
    security: 'Security',
    changePassword: 'Change Password',
    twoFactor: 'Two-Factor Authentication',
    deleteAccount: 'Delete Account',
    signOut: 'Sign Out',
  },

  // Auth
  auth: {
    login: 'Log In',
    signup: 'Sign Up',
    logout: 'Log Out',
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    forgotPassword: 'Forgot Password?',
    resetPassword: 'Reset Password',
    rememberMe: 'Remember me',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    dontHaveAccount: "Don't have an account?",
    orContinueWith: 'Or continue with',
    termsAgree: 'I agree to the Terms of Service and Privacy Policy',
    verifyEmail: 'Verify Email',
    checkEmail: 'Check your email',
  },

  // Errors
  errors: {
    generic: 'Something went wrong. Please try again.',
    network: 'Network error. Please check your connection.',
    unauthorized: 'You are not authorized to perform this action.',
    notFound: 'The requested resource was not found.',
    serverError: 'Server error. Please try again later.',
    uploadFailed: 'Upload failed. Please try again.',
    processingFailed: 'Processing failed. Please try again.',
    invalidFile: 'Invalid file format.',
    fileTooLarge: 'File is too large.',
    sessionExpired: 'Your session has expired. Please log in again.',
  },

  // Success Messages
  success: {
    saved: 'Saved successfully',
    deleted: 'Deleted successfully',
    uploaded: 'Uploaded successfully',
    downloaded: 'Downloaded successfully',
    copied: 'Copied to clipboard',
    generated: 'Generated successfully',
    updated: 'Updated successfully',
  },

  // Tooltips
  tooltips: {
    zoom: 'Zoom',
    pan: 'Pan',
    reset: 'Reset View',
    undo: 'Undo',
    redo: 'Redo',
    brush: 'Brush Tool',
    eraser: 'Eraser Tool',
    download: 'Download Image',
    share: 'Share Image',
  },

  // Settings Modal
  settingsModal: {
    title: 'Generation Settings',
    subtitle: 'Configure your AI generation preferences',
    requiredWarning: 'Please configure settings before generating',
    gender: 'Gender',
    jewelryType: 'Jewelry Type',
    aspectRatio: 'Aspect Ratio',
    faceVisibility: 'Model Face',
    showFace: 'Show Face',
    hideFace: 'Hide Face',
    showFaceDesc: 'Full model with face visible',
    hideFaceDesc: 'Cropped, focus on jewelry',
    vertical: 'Vertical',
    horizontal: 'Horizontal',
    applyToAll: 'Apply to all future generations',
    saveSettings: 'Save Settings',
    story: 'Story',
    standard: 'Standard',
    classic: 'Classic',
    portrait: 'Portrait',
    square: 'Square',
    landscape: 'Landscape',
    ultrawide: 'Ultrawide',
  },

  // Right Sidebar
  rightSidebar: {
    aiGeneration: 'AI Generation',
    settings: 'Settings',
    settingsComplete: 'Settings Complete',
    configureSettings: 'Configure Settings',
    browseLibrary: 'Browse more presets in Library',
    mostUsed: '10 most used',
  },

  // Preset Modes
  presets: {
    quick: 'Quick',
    selective: 'Selective',
    advanced: 'Advanced',
    random: 'Random',
    generate: 'Generate',
    style: 'Style',
    model: 'Model',
    setting: 'Setting',
    mood: 'Mood',
    camera: 'Camera',
    lighting: 'Lighting',
    colorGrading: 'Color Grading',
    hair: 'Hair',
    nails: 'Nails',
    makeup: 'Makeup',
    skinTone: 'Skin Tone',
    facialHair: 'Facial Hair',
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    welcome: 'Welcome back',
    recentActivity: 'Recent Activity',
    quickActions: 'Quick Actions',
    startCreating: 'Start Creating',
    viewGallery: 'View Gallery',
    openStudio: 'Open Studio',
  },

  // Batch
  batch: {
    title: 'Batch Processing',
    uploadImages: 'Upload Images',
    processAll: 'Process All',
    downloading: 'Downloading...',
    processing: 'Processing...',
    completed: 'Completed',
    failed: 'Failed',
    pending: 'Pending',
    selectPreset: 'Select a preset for batch processing',
    dragDropImages: 'Drag and drop images here',
    orClickToUpload: 'or click to upload',
    imagesSelected: 'images selected',
    clearAll: 'Clear All',
    downloadAll: 'Download All',
  },

  // Confirmation
  confirm: {
    deleteTitle: 'Delete Item',
    deleteMessage: 'Are you sure you want to delete this item?',
    deleteConfirm: 'Delete',
    cancelAction: 'Cancel',
    unsavedChanges: 'You have unsaved changes',
    leavePageMessage: 'Are you sure you want to leave? Changes will be lost.',
    stay: 'Stay',
    leave: 'Leave',
  },

  // Empty States
  empty: {
    noImages: 'No images yet',
    noPresets: 'No presets found',
    noResults: 'No results found',
    startByUploading: 'Start by uploading an image',
    tryDifferentSearch: 'Try a different search term',
  },

  // Time
  time: {
    justNow: 'Just now',
    minutesAgo: 'minutes ago',
    hoursAgo: 'hours ago',
    daysAgo: 'days ago',
    seconds: 's',
    minutes: 'm',
  },
};
