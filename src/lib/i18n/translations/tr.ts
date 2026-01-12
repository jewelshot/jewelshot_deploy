/**
 * Turkish Translations / Türkçe Çeviriler
 */

import { TranslationKeys } from '../types';

export const tr: TranslationKeys = {
  // Genel
  common: {
    loading: 'Yükleniyor...',
    error: 'Hata',
    success: 'Başarılı',
    cancel: 'İptal',
    save: 'Kaydet',
    delete: 'Sil',
    edit: 'Düzenle',
    close: 'Kapat',
    confirm: 'Onayla',
    back: 'Geri',
    next: 'İleri',
    previous: 'Önceki',
    submit: 'Gönder',
    search: 'Ara',
    filter: 'Filtrele',
    clear: 'Temizle',
    apply: 'Uygula',
    reset: 'Sıfırla',
    download: 'İndir',
    upload: 'Yükle',
    copy: 'Kopyala',
    share: 'Paylaş',
    view: 'Görüntüle',
    more: 'Daha Fazla',
    less: 'Daha Az',
    all: 'Tümü',
    none: 'Hiçbiri',
    yes: 'Evet',
    no: 'Hayır',
    or: 'veya',
    and: 've',
  },

  // Navigasyon
  nav: {
    home: 'Ana Sayfa',
    studio: 'Stüdyo',
    gallery: 'Galeri',
    library: 'Kütüphane',
    batch: 'Toplu İşlem',
    profile: 'Profil',
    settings: 'Ayarlar',
    help: 'Yardım',
    logout: 'Çıkış Yap',
    login: 'Giriş Yap',
    signup: 'Kayıt Ol',
  },

  // Stüdyo
  studio: {
    title: 'AI Takı Stüdyosu',
    uploadImage: 'Görsel Yükle',
    dropImage: 'Takı görselinizi buraya bırakın',
    supportedFormats: 'Desteklenen formatlar: JPG, PNG, WebP',
    maxFileSize: 'Maksimum dosya boyutu: 10MB',
    generate: 'Oluştur',
    generating: 'Oluşturuluyor...',
    selectPreset: 'Preset Seç',
    quickPresets: 'Hızlı Presetler',
    selectivePresets: 'Seçimli',
    advancedPresets: 'Gelişmiş',
    generationSettings: 'Oluşturma Ayarları',
    jewelryType: 'Takı Türü',
    gender: 'Cinsiyet',
    aspectRatio: 'En-Boy Oranı',
    faceVisibility: 'Model Yüzü',
    showFace: 'Yüzü Göster',
    hideFace: 'Yüzü Gizle',
    style: 'Stil',
    model: 'Model',
    setting: 'Mekan',
    mood: 'Atmosfer',
    random: 'Rastgele',
    applyToAll: 'Tümüne Uygula',
    settingsComplete: 'Ayarlar Tamam',
    settingsIncomplete: 'Ayarları Yapılandır',
    configureSettings: 'Oluşturma ayarlarını yapılandırın',
  },

  // Takı Türleri
  jewelry: {
    ring: 'Yüzük',
    necklace: 'Kolye',
    earring: 'Küpe',
    bracelet: 'Bileklik',
    all: 'Tüm Takılar',
  },

  // Cinsiyet
  gender: {
    women: 'Kadın',
    men: 'Erkek',
    unisex: 'Unisex',
  },

  // AI İşleme
  ai: {
    processing: 'İşleniyor...',
    processingVia: 'İşleme yapan',
    initializing: 'Başlatılıyor...',
    queued: 'Sırada',
    aiProcessing: 'AI İşleniyor',
    preparing: 'Hazırlanıyor...',
    complete: 'Tamamlandı',
    failed: 'Başarısız',
    tryAgain: 'Tekrar Dene',
    estimatedTime: 'Tahmini süre',
  },

  // Galeri
  gallery: {
    title: 'Galerim',
    noImages: 'Henüz görsel yok',
    selectAll: 'Tümünü Seç',
    deselectAll: 'Seçimi Kaldır',
    deleteSelected: 'Seçilenleri Sil',
    downloadSelected: 'Seçilenleri İndir',
    emptyGallery: 'Galeriniz boş',
    startCreating: "Stüdyo'da oluşturmaya başlayın",
  },

  // Kütüphane
  library: {
    title: 'Preset Kütüphanesi',
    presetLibrary: 'Preset Kütüphanesi',
    searchPresets: 'Preset ara...',
    categories: 'Kategoriler',
    allCategories: 'Tüm Kategoriler',
    noResults: 'Preset bulunamadı',
    usePreset: 'Preseti Kullan',
  },

  // Profil
  profile: {
    title: 'Profil',
    account: 'Hesap',
    email: 'E-posta',
    name: 'İsim',
    plan: 'Plan',
    credits: 'Krediler',
    creditsRemaining: 'kalan kredi',
    language: 'Dil',
    selectLanguage: 'Dil Seçin',
    theme: 'Tema',
    darkMode: 'Karanlık Mod',
    lightMode: 'Aydınlık Mod',
    notifications: 'Bildirimler',
    security: 'Güvenlik',
    changePassword: 'Şifre Değiştir',
    twoFactor: 'İki Faktörlü Doğrulama',
    deleteAccount: 'Hesabı Sil',
    signOut: 'Çıkış Yap',
  },

  // Kimlik Doğrulama
  auth: {
    login: 'Giriş Yap',
    signup: 'Kayıt Ol',
    logout: 'Çıkış Yap',
    email: 'E-posta',
    password: 'Şifre',
    confirmPassword: 'Şifre Tekrar',
    forgotPassword: 'Şifremi Unuttum',
    resetPassword: 'Şifre Sıfırla',
    rememberMe: 'Beni hatırla',
    createAccount: 'Hesap Oluştur',
    alreadyHaveAccount: 'Zaten hesabınız var mı?',
    dontHaveAccount: 'Hesabınız yok mu?',
    orContinueWith: 'Veya şununla devam edin',
    termsAgree: 'Kullanım Şartlarını ve Gizlilik Politikasını kabul ediyorum',
    verifyEmail: 'E-postayı Doğrula',
    checkEmail: 'E-postanızı kontrol edin',
  },

  // Hatalar
  errors: {
    generic: 'Bir şeyler yanlış gitti. Lütfen tekrar deneyin.',
    network: 'Ağ hatası. Lütfen bağlantınızı kontrol edin.',
    unauthorized: 'Bu işlemi gerçekleştirme yetkiniz yok.',
    notFound: 'İstenen kaynak bulunamadı.',
    serverError: 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.',
    uploadFailed: 'Yükleme başarısız. Lütfen tekrar deneyin.',
    processingFailed: 'İşlem başarısız. Lütfen tekrar deneyin.',
    invalidFile: 'Geçersiz dosya formatı.',
    fileTooLarge: 'Dosya çok büyük.',
    sessionExpired: 'Oturumunuz sona erdi. Lütfen tekrar giriş yapın.',
  },

  // Başarı Mesajları
  success: {
    saved: 'Başarıyla kaydedildi',
    deleted: 'Başarıyla silindi',
    uploaded: 'Başarıyla yüklendi',
    downloaded: 'Başarıyla indirildi',
    copied: 'Panoya kopyalandı',
    generated: 'Başarıyla oluşturuldu',
    updated: 'Başarıyla güncellendi',
  },

  // Araç İpuçları
  tooltips: {
    zoom: 'Yakınlaştır',
    pan: 'Kaydır',
    reset: 'Görünümü Sıfırla',
    undo: 'Geri Al',
    redo: 'Yinele',
    brush: 'Fırça Aracı',
    eraser: 'Silgi Aracı',
    download: 'Görseli İndir',
    share: 'Görseli Paylaş',
  },

  // Ayarlar Modalı
  settingsModal: {
    title: 'Oluşturma Ayarları',
    subtitle: 'AI oluşturma tercihlerinizi yapılandırın',
    requiredWarning: 'Lütfen oluşturmadan önce ayarları yapılandırın',
    gender: 'Cinsiyet',
    jewelryType: 'Takı Türü',
    aspectRatio: 'En-Boy Oranı',
    faceVisibility: 'Model Yüzü',
    showFace: 'Yüzü Göster',
    hideFace: 'Yüzü Gizle',
    showFaceDesc: 'Yüzü görünen tam model',
    hideFaceDesc: 'Kırpılmış, takıya odaklı',
    vertical: 'Dikey',
    horizontal: 'Yatay',
    applyToAll: 'Gelecek tüm oluşturmalara uygula',
    saveSettings: 'Ayarları Kaydet',
    story: 'Hikaye',
    standard: 'Standart',
    classic: 'Klasik',
    portrait: 'Portre',
    square: 'Kare',
    landscape: 'Manzara',
    ultrawide: 'Ultra Geniş',
  },

  // Sağ Kenar Çubuğu
  rightSidebar: {
    aiGeneration: 'AI Oluşturma',
    settings: 'Ayarlar',
    settingsComplete: 'Ayarlar Tamam',
    configureSettings: 'Ayarları Yapılandır',
    browseLibrary: "Daha fazla preset için Kütüphane'ye göz atın",
    mostUsed: 'En çok kullanılan 10',
  },

  // Preset Modları
  presets: {
    quick: 'Hızlı',
    selective: 'Seçimli',
    advanced: 'Gelişmiş',
    random: 'Rastgele',
    generate: 'Oluştur',
    style: 'Stil',
    model: 'Model',
    setting: 'Mekan',
    mood: 'Atmosfer',
    camera: 'Kamera',
    lighting: 'Işık',
    colorGrading: 'Renk Düzenleme',
    hair: 'Saç',
    nails: 'Tırnak',
    makeup: 'Makyaj',
    skinTone: 'Ten Rengi',
    facialHair: 'Yüz Kılları',
  },

  // Dashboard
  dashboard: {
    title: 'Kontrol Paneli',
    welcome: 'Tekrar hoş geldiniz',
    recentActivity: 'Son Aktivite',
    quickActions: 'Hızlı İşlemler',
    startCreating: 'Oluşturmaya Başla',
    viewGallery: 'Galeriyi Görüntüle',
    openStudio: "Stüdyo'yu Aç",
  },

  // Toplu İşlem
  batch: {
    title: 'Toplu İşlem',
    uploadImages: 'Görselleri Yükle',
    processAll: 'Tümünü İşle',
    downloading: 'İndiriliyor...',
    processing: 'İşleniyor...',
    completed: 'Tamamlandı',
    failed: 'Başarısız',
    pending: 'Beklemede',
    selectPreset: 'Toplu işlem için bir preset seçin',
    dragDropImages: 'Görselleri buraya sürükleyip bırakın',
    orClickToUpload: 'veya yüklemek için tıklayın',
    imagesSelected: 'görsel seçildi',
    clearAll: 'Tümünü Temizle',
    downloadAll: 'Tümünü İndir',
  },

  // Onay
  confirm: {
    deleteTitle: 'Öğeyi Sil',
    deleteMessage: 'Bu öğeyi silmek istediğinizden emin misiniz?',
    deleteConfirm: 'Sil',
    cancelAction: 'İptal',
    unsavedChanges: 'Kaydedilmemiş değişiklikleriniz var',
    leavePageMessage: 'Ayrılmak istediğinizden emin misiniz? Değişiklikler kaybolacak.',
    stay: 'Kal',
    leave: 'Ayrıl',
  },

  // Boş Durumlar
  empty: {
    noImages: 'Henüz görsel yok',
    noPresets: 'Preset bulunamadı',
    noResults: 'Sonuç bulunamadı',
    startByUploading: 'Bir görsel yükleyerek başlayın',
    tryDifferentSearch: 'Farklı bir arama terimi deneyin',
  },

  // Zaman
  time: {
    justNow: 'Az önce',
    minutesAgo: 'dakika önce',
    hoursAgo: 'saat önce',
    daysAgo: 'gün önce',
    seconds: 'sn',
    minutes: 'dk',
  },
};
