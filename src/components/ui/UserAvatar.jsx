import { useState } from 'react';
import { User } from 'lucide-react';

const SIZES = {
  sm: { box: 'w-8 h-8', icon: 'w-3.5 h-3.5', text: 'text-xs' },
  md: { box: 'w-10 h-10', icon: 'w-4 h-4', text: 'text-sm' },
  lg: { box: 'w-24 h-24', icon: 'w-10 h-10', text: 'text-2xl' },
  xl: { box: 'w-28 h-28', icon: 'w-12 h-12', text: 'text-3xl' },
};

function getInitials(user) {
  if (user?.displayName) {
    const parts = user.displayName.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  }
  if (user?.email) return user.email[0].toUpperCase();
  return '?';
}

export function UserAvatar({ user, size = 'md', rounded = 'full', className = '' }) {
  const [imgError, setImgError] = useState(false);
  const s = SIZES[size] || SIZES.md;
  const photoURL = user?.photoURL;
  const showImage = photoURL && !imgError;
  const radius = rounded === 'xl' ? 'rounded-2xl' : 'rounded-full';

  return (
    <div className={`relative shrink-0 ${s.box} ${className}`}>
      {showImage ? (
        <img
          src={photoURL}
          alt={user?.displayName || 'Profile'}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className={`${s.box} ${radius} object-cover ring-2 ring-[#00f0ff]/40 shadow-lg shadow-[#00f0ff]/10`}
        />
      ) : (
        <div
          className={`${s.box} ${radius} flex items-center justify-center font-bold ${s.text} text-white ring-2 ring-[#00f0ff]/30 bg-gradient-to-br from-[#00f0ff]/35 via-[#a855f7]/30 to-[#0d1424]`}
        >
          {user ? (
            <span className="select-none drop-shadow-sm">{getInitials(user)}</span>
          ) : (
            <User className={s.icon} style={{ color: '#00f0ff' }} />
          )}
        </div>
      )}
      {size !== 'sm' && (
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#00ff88] border-2 border-[#050810]" />
      )}
    </div>
  );
}
