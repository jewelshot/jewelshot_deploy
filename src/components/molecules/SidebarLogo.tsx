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
    <div className="group relative mb-4 flex cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-xl border border-[rgba(139,92,246,0.15)] bg-gradient-to-br from-[rgba(139,92,246,0.08)] to-[rgba(99,102,241,0.05)] px-4 py-4 transition-all duration-300 ease-in-out before:absolute before:inset-0 before:bg-gradient-to-br before:from-[rgba(139,92,246,0.15)] before:to-[rgba(99,102,241,0.1)] before:opacity-0 before:transition-opacity hover:translate-y-[-1px] hover:border-[rgba(139,92,246,0.4)] hover:shadow-[0_4px_16px_rgba(139,92,246,0.2)] hover:before:opacity-100">
      {/* Logo Icon */}
      <img 
        src="/logo.png" 
        alt="Jewelshot" 
        className="relative z-10 h-10 w-10 transition-all duration-300 ease-in-out group-hover:rotate-[-5deg] group-hover:scale-110"
      />

      {/* Logo Text */}
      <div className="relative z-10 flex flex-col items-start justify-center gap-0.5">
        <span className="text-base font-bold leading-tight tracking-tight text-white">
          Jewelshot
        </span>
        <span className="text-[10px] font-semibold uppercase leading-none tracking-widest text-purple-400/80">
          STUDIO
        </span>
      </div>
    </div>
  );
}

export default SidebarLogo;
