/**
 * User Action Menu
 * 
 * Dropdown menu with user management actions
 */

'use client';

import { useState } from 'react';
import { MoreVertical, Eye, Plus, Minus, Ban, Trash2, Mail } from 'lucide-react';

interface UserActionMenuProps {
  userId: string;
  userEmail: string;
  onViewDetails: () => void;
  onAddCredits: () => void;
  onRemoveCredits: () => void;
  onBanUser: () => void;
  onDeleteUser: () => void;
}

export function UserActionMenu({
  userId,
  userEmail,
  onViewDetails,
  onAddCredits,
  onRemoveCredits,
  onBanUser,
  onDeleteUser,
}: UserActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="rounded-lg border border-white/20 bg-white/10 p-2 transition-all hover:bg-white/20"
      >
        <MoreVertical className="h-4 w-4 text-white" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full z-20 mt-2 w-48 rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl backdrop-blur-sm">
            <button
              onClick={() => {
                onViewDetails();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white transition-colors hover:bg-white/10"
            >
              <Eye className="h-4 w-4" />
              View Details
            </button>
            
            <button
              onClick={() => {
                onAddCredits();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-green-400 transition-colors hover:bg-white/10"
            >
              <Plus className="h-4 w-4" />
              Add Credits
            </button>
            
            <button
              onClick={() => {
                onRemoveCredits();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-orange-400 transition-colors hover:bg-white/10"
            >
              <Minus className="h-4 w-4" />
              Remove Credits
            </button>

            <div className="border-t border-white/10" />
            
            <button
              onClick={() => {
                onBanUser();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 transition-colors hover:bg-white/10"
            >
              <Ban className="h-4 w-4" />
              Ban User
            </button>
            
            <button
              onClick={() => {
                onDeleteUser();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-500 transition-colors hover:bg-white/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete User
            </button>
          </div>
        </>
      )}
    </div>
  );
}

