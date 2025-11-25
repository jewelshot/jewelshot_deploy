import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PageFormat = 'a4-portrait' | 'a4-landscape';
export type PageLayout = 'grid' | 'list' | 'magazine';

export interface MetadataField {
  key: string;
  label: string;
  enabled: boolean;
}

export interface MarginSettings {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface CoverSettings {
  frontCover?: string; // Image URL
  backCover?: string; // Image URL
}

export interface ContactInfo {
  companyName?: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
}

export interface CatalogueSettings {
  // Format & Layout
  pageFormat: PageFormat;
  pageLayout: PageLayout;
  imagesPerPage: number;

  // Metadata Fields
  metadataFields: MetadataField[];

  // Page Settings
  margins: MarginSettings;
  showPageNumbers: boolean;

  // Cover & Contact
  cover: CoverSettings;
  contactInfo: ContactInfo;

  // Image Order (array of image IDs in custom order)
  imageOrder: string[];
}

interface CatalogueStore {
  settings: CatalogueSettings;

  // Format & Layout
  setPageFormat: (format: PageFormat) => void;
  setPageLayout: (layout: PageLayout) => void;
  setImagesPerPage: (count: number) => void;

  // Metadata Fields
  toggleMetadataField: (key: string) => void;
  setMetadataFieldEnabled: (key: string, enabled: boolean) => void;

  // Margins
  setMargin: (side: keyof MarginSettings, value: number) => void;
  setMargins: (margins: Partial<MarginSettings>) => void;

  // Page Numbers
  setShowPageNumbers: (show: boolean) => void;

  // Cover
  setFrontCover: (url?: string) => void;
  setBackCover: (url?: string) => void;

  // Contact Info
  setContactInfo: (info: Partial<ContactInfo>) => void;

  // Image Order
  setImageOrder: (order: string[]) => void;
  moveImage: (fromIndex: number, toIndex: number) => void;

  // Reset
  resetSettings: () => void;
}

const defaultMetadataFields: MetadataField[] = [
  { key: 'fileName', label: 'File Name', enabled: true },
  { key: 'ct', label: 'CT (Carat)', enabled: true },
  { key: 'color', label: 'Color', enabled: true },
  { key: 'clarity', label: 'Clarity', enabled: true },
  { key: 'ayar', label: 'Ayar (Setting)', enabled: true },
  { key: 'gram', label: 'Gram (Weight)', enabled: true },
  { key: 'price', label: 'Price', enabled: false },
  { key: 'sku', label: 'SKU', enabled: false },
  { key: 'description', label: 'Description', enabled: false },
  { key: 'notes', label: 'Notes', enabled: false },
];

const defaultSettings: CatalogueSettings = {
  pageFormat: 'a4-portrait',
  pageLayout: 'grid',
  imagesPerPage: 4,
  metadataFields: defaultMetadataFields,
  margins: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  },
  showPageNumbers: true,
  cover: {},
  contactInfo: {},
  imageOrder: [],
};

export const useCatalogueStore = create<CatalogueStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      setPageFormat: (format) =>
        set((state) => ({
          settings: { ...state.settings, pageFormat: format },
        })),

      setPageLayout: (layout) =>
        set((state) => ({
          settings: { ...state.settings, pageLayout: layout },
        })),

      setImagesPerPage: (count) =>
        set((state) => ({
          settings: { ...state.settings, imagesPerPage: count },
        })),

      toggleMetadataField: (key) =>
        set((state) => ({
          settings: {
            ...state.settings,
            metadataFields: state.settings.metadataFields.map((field) =>
              field.key === key ? { ...field, enabled: !field.enabled } : field
            ),
          },
        })),

      setMetadataFieldEnabled: (key, enabled) =>
        set((state) => ({
          settings: {
            ...state.settings,
            metadataFields: state.settings.metadataFields.map((field) =>
              field.key === key ? { ...field, enabled } : field
            ),
          },
        })),

      setMargin: (side, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            margins: { ...state.settings.margins, [side]: value },
          },
        })),

      setMargins: (margins) =>
        set((state) => ({
          settings: {
            ...state.settings,
            margins: { ...state.settings.margins, ...margins },
          },
        })),

      setShowPageNumbers: (show) =>
        set((state) => ({
          settings: { ...state.settings, showPageNumbers: show },
        })),

      setFrontCover: (url) =>
        set((state) => ({
          settings: {
            ...state.settings,
            cover: { ...state.settings.cover, frontCover: url },
          },
        })),

      setBackCover: (url) =>
        set((state) => ({
          settings: {
            ...state.settings,
            cover: { ...state.settings.cover, backCover: url },
          },
        })),

      setContactInfo: (info) =>
        set((state) => ({
          settings: {
            ...state.settings,
            contactInfo: { ...state.settings.contactInfo, ...info },
          },
        })),

      setImageOrder: (order) =>
        set((state) => ({
          settings: { ...state.settings, imageOrder: order },
        })),

      moveImage: (fromIndex, toIndex) =>
        set((state) => {
          const newOrder = [...state.settings.imageOrder];
          const [moved] = newOrder.splice(fromIndex, 1);
          newOrder.splice(toIndex, 0, moved);
          return {
            settings: { ...state.settings, imageOrder: newOrder },
          };
        }),

      resetSettings: () =>
        set({
          settings: defaultSettings,
        }),
    }),
    {
      name: 'jewelshot_catalogue_settings',
    }
  )
);
