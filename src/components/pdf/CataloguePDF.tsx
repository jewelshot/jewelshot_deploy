import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';
import type { CatalogueSettings, ContactInfo } from '@/store/catalogueStore';
import type { ImageMetadata } from '@/types/image-metadata';

// Register fonts if needed (optional)
// Font.register({
//   family: 'Roboto',
//   src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxK.woff2',
// });

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#FFFFFF',
  },
  pagePortrait: {
    width: 595.28, // A4 width in points (210mm)
    height: 841.89, // A4 height in points (297mm)
  },
  pageLandscape: {
    width: 841.89,
    height: 595.28,
  },
  // Cover Page
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  coverTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 20,
  },
  coverSubtitle: {
    fontSize: 24,
    color: '#666666',
  },
  // Content Page
  contentPage: {
    display: 'flex',
    flexDirection: 'column',
  },
  gridContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  // Image Item
  imageItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  imageWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  metadata: {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    marginTop: 8,
  },
  metadataRow: {
    fontSize: 8,
    color: '#333333',
  },
  metadataLabel: {
    fontWeight: 'bold',
  },
  // Page Number
  pageNumber: {
    position: 'absolute',
    fontSize: 10,
    color: '#666666',
  },
  // Contact Info
  contactInfo: {
    position: 'absolute',
    fontSize: 8,
    color: '#666666',
  },
});

interface CataloguePDFProps {
  settings: CatalogueSettings;
  images: Array<{
    imageId: string;
    imageUrl?: string;
    metadata?: ImageMetadata;
  }>;
}

export const CataloguePDF: React.FC<CataloguePDFProps> = ({
  settings,
  images,
}) => {
  const isPortrait = settings.pageFormat === 'a4-portrait';
  const pageWidth = isPortrait ? 595.28 : 841.89;
  const pageHeight = isPortrait ? 841.89 : 595.28;

  const { top, bottom, left, right } = settings.margins;
  const contentWidth = pageWidth - left - right;
  const contentHeight = pageHeight - top - bottom;

  // Calculate grid layout
  const imagesPerPage = settings.imagesPerPage;
  const cols =
    imagesPerPage === 1
      ? 1
      : imagesPerPage === 2
        ? 2
        : imagesPerPage === 4
          ? 2
          : imagesPerPage === 6
            ? 3
            : imagesPerPage === 8
              ? 4
              : 4;
  const rows = Math.ceil(imagesPerPage / cols);

  const itemWidth = contentWidth / cols;
  const itemHeight = contentHeight / rows;

  // Split images into pages
  const pages: (typeof images)[] = [];
  for (let i = 0; i < images.length; i += imagesPerPage) {
    pages.push(images.slice(i, i + imagesPerPage));
  }

  // Get enabled metadata fields
  const enabledFields = settings.metadataFields.filter((f) => f.enabled);

  return (
    <Document>
      {/* Front Cover */}
      {settings.cover.frontCover && (
        <Page
          size="A4"
          orientation={isPortrait ? 'portrait' : 'landscape'}
          style={[styles.page, styles.coverPage]}
        >
          <Image src={settings.cover.frontCover} style={styles.coverImage} />
        </Page>
      )}

      {/* Content Pages */}
      {pages.map((pageImages, pageIndex) => (
        <Page
          key={`page-${pageIndex}`}
          size="A4"
          orientation={isPortrait ? 'portrait' : 'landscape'}
          style={[
            styles.page,
            styles.contentPage,
            {
              paddingTop: top,
              paddingBottom: bottom,
              paddingLeft: left,
              paddingRight: right,
            },
          ]}
        >
          {/* Images Grid */}
          <View style={styles.gridContainer}>
            {pageImages.map((item, index) => (
              <View
                key={item.imageId}
                style={[
                  styles.imageItem,
                  {
                    width: itemWidth,
                    height: itemHeight,
                    padding: 8,
                  },
                ]}
              >
                {/* Image */}
                <View
                  style={[
                    styles.imageWrapper,
                    {
                      width: itemWidth - 16,
                      height:
                        enabledFields.length > 0
                          ? itemHeight * 0.7
                          : itemHeight - 16,
                    },
                  ]}
                >
                  {item.imageUrl ? (
                    <Image src={item.imageUrl} style={styles.image} />
                  ) : (
                    <Text style={{ fontSize: 10, color: '#999' }}>
                      No Image
                    </Text>
                  )}
                </View>

                {/* Metadata */}
                {enabledFields.length > 0 && item.metadata && (
                  <View style={styles.metadata}>
                    {enabledFields.map((field) => {
                      const value =
                        item.metadata?.[field.key as keyof ImageMetadata];
                      if (!value) return null;
                      return (
                        <Text key={field.key} style={styles.metadataRow}>
                          <Text style={styles.metadataLabel}>
                            {field.label}:
                          </Text>{' '}
                          {String(value)}
                        </Text>
                      );
                    })}
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Page Number */}
          {settings.showPageNumbers && (
            <Text
              style={[
                styles.pageNumber,
                {
                  bottom: bottom / 2 - 5,
                  right: pageWidth / 2 - 10,
                },
              ]}
            >
              {pageIndex + 1}
            </Text>
          )}

          {/* Contact Info (on first page only) */}
          {pageIndex === 0 && settings.contactInfo.companyName && (
            <View
              style={[
                styles.contactInfo,
                {
                  bottom: bottom / 2 - 5,
                  left: left,
                },
              ]}
            >
              <ContactInfoComponent info={settings.contactInfo} />
            </View>
          )}
        </Page>
      ))}

      {/* Back Cover */}
      {settings.cover.backCover && (
        <Page
          size="A4"
          orientation={isPortrait ? 'portrait' : 'landscape'}
          style={[styles.page, styles.coverPage]}
        >
          <Image src={settings.cover.backCover} style={styles.coverImage} />
        </Page>
      )}
    </Document>
  );
};

// Contact Info Component
const ContactInfoComponent: React.FC<{ info: ContactInfo }> = ({ info }) => {
  return (
    <>
      {info.companyName && <Text>{info.companyName}</Text>}
      {info.address && <Text>{info.address}</Text>}
      {info.phone && <Text>Tel: {info.phone}</Text>}
      {info.email && <Text>Email: {info.email}</Text>}
      {info.website && <Text>{info.website}</Text>}
    </>
  );
};
