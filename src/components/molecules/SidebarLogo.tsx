/**
 * SidebarLogo Component
 *
 * Premium logo display with icon and text.
 * Features hover animations and gradient effects.
 *
 * @example
 * ```tsx
 * <SidebarLogo />
 * ```
 */

'use client';

// Logo image used instead of icon

export function SidebarLogo() {
  return (
    <div className="group relative flex cursor-pointer items-center gap-2.5 rounded-lg border border-[rgba(139,92,246,0.12)] bg-gradient-to-br from-[rgba(139,92,246,0.06)] to-transparent px-3 py-2.5 transition-all duration-200 hover:border-[rgba(139,92,246,0.3)] hover:bg-[rgba(139,92,246,0.08)]">
      {/* Logo Icon */}
      <img 
        src="/logo.png" 
        alt="Jewelshot®" 
        className="h-8 w-8 transition-transform duration-200 group-hover:scale-105"
      />

      {/* Logo Text */}
      <div className="flex flex-col">
        <span className="text-sm font-semibold leading-tight text-white">
          Jewelshot®
        </span>
        <span className="text-[9px] font-medium uppercase tracking-wider text-purple-400/70">
          Studio
        </span>
      </div>
    </div>
  );
}

export default SidebarLogo;
