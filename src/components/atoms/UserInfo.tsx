import React from 'react';

interface UserInfoProps {
  /**
   * User's display name
   */
  name: string;
  /**
   * User plan type
   */
  plan?: 'Free' | 'Pro' | 'Team';
}

export function UserInfo({ name, plan = 'Free' }: UserInfoProps) {
  const planColors = {
    Free: 'bg-white/10 text-white/60',
    Pro: 'bg-purple-500/20 text-purple-400',
    Team: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[13px] font-medium text-white">{name}</span>
      <span className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${planColors[plan]}`}>
        {plan}
      </span>
    </div>
  );
}

export default UserInfo;
