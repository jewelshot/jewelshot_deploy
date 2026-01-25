/**
 * AppProviders Component
 * 
 * Combines all app-level providers for clean layout integration
 */

'use client';

import { type ReactNode } from 'react';
import { AnnouncementProvider, useAnnouncementContext } from '@/hooks/useAnnouncements';
import { PermissionProvider } from '@/hooks/usePermissions';
import { AnnouncementModal } from '@/components/molecules/AnnouncementModal';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Inner component that uses announcement context
 */
function AnnouncementModalController() {
  const { showModal, currentModalAnnouncement, dismissModal } = useAnnouncementContext();

  if (!showModal || !currentModalAnnouncement) {
    return null;
  }

  return (
    <AnnouncementModal
      announcement={currentModalAnnouncement}
      onDismiss={dismissModal}
      isCritical={currentModalAnnouncement.priority === 'critical'}
    />
  );
}

/**
 * AppProviders
 * 
 * Wraps children with:
 * - PermissionProvider (user permissions)
 * - AnnouncementProvider (admin announcements)
 * - AnnouncementModal (for important announcements)
 */
export function AppProviders({ children }: AppProvidersProps) {
  return (
    <PermissionProvider>
      <AnnouncementProvider>
        {children}
        <AnnouncementModalController />
      </AnnouncementProvider>
    </PermissionProvider>
  );
}

export default AppProviders;
