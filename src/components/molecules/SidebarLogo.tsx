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
    <div className="duration-400 before:duration-400 relative mb-3 flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-[rgba(139,92,246,0.15)] bg-gradient-to-br from-[rgba(139,92,246,0.08)] to-[rgba(99,102,241,0.05)] px-3 py-3 transition-all ease-in-out before:absolute before:inset-0 before:bg-gradient-to-br before:from-[rgba(139,92,246,0.15)] before:to-[rgba(99,102,241,0.1)] before:opacity-0 before:transition-opacity hover:translate-y-[-1px] hover:border-[rgba(139,92,246,0.4)] hover:shadow-[0_4px_16px_rgba(139,92,246,0.2)] hover:before:opacity-100">
      {/* Logo Icon */}
      <img 
        src="/logo.png" 
        alt="Jewelshot" 
        className="relative z-10 h-9 w-9 transition-all duration-400 ease-in-out group-hover:rotate-[-5deg] group-hover:scale-[1.08]"
      />

      {/* Logo Text */}
      <div className="relative z-10 flex flex-col gap-[2px]">
        <span className="text-[15px] font-bold leading-[1.2] tracking-[-0.03em] text-white">
          Jewelshot
        </span>
        <span className="text-[9px] font-semibold uppercase leading-none tracking-[0.1em] text-[rgba(139,92,246,0.8)]">
          STUDIO
        </span>
      </div>
    </div>
  );
}

export default SidebarLogo;
