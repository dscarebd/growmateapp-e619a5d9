export const YouTubeIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '1em', minHeight: '1em' }}>
    <rect width="24" height="24" rx="5" fill="#FF0000"/>
    <polygon points="9.5,7 9.5,17 17.5,12" fill="#fff"/>
  </svg>
);

export const InstagramIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '1em', minHeight: '1em' }}>
    <defs>
      <radialGradient id="ig-gradient" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497"/>
        <stop offset="5%" stopColor="#fdf497"/>
        <stop offset="45%" stopColor="#fd5949"/>
        <stop offset="60%" stopColor="#d6249f"/>
        <stop offset="90%" stopColor="#285AEB"/>
      </radialGradient>
    </defs>
    <rect width="24" height="24" rx="6" fill="url(#ig-gradient)"/>
    <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="2" fill="none"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="#fff"/>
  </svg>
);

export const TikTokIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '1em', minHeight: '1em' }}>
    <rect width="24" height="24" rx="5" fill="#000"/>
    <path d="M16.5 4h-2.8v12.2c0 1.7-1.4 3-3 3s-3-1.4-3-3 1.4-3 3-3c.3 0 .6 0 .9.1V10.4c-.3 0-.6-.1-.9-.1-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6V10c1.2.9 2.7 1.4 4.3 1.4V8.5c-2.4 0-4.4-2-4.4-4.4V4z" fill="#25F4EE"/>
    <path d="M17 4.5h-2.8v12.2c0 1.7-1.4 3-3 3s-3-1.4-3-3 1.4-3 3-3c.3 0 .6 0 .9.1V10.9c-.3 0-.6-.1-.9-.1-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6v-6.3c1.2.9 2.7 1.4 4.3 1.4V9c-2.4 0-4.4-2-4.4-4.4V4.5z" fill="#FE2C55"/>
    <path d="M16.8 4.2h-2.8v12.2c0 1.7-1.4 3-3 3s-3-1.4-3-3 1.4-3 3-3c.3 0 .6 0 .9.1V10.6c-.3 0-.6-.1-.9-.1-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6V10.2c1.2.9 2.7 1.4 4.3 1.4V8.7c-2.4 0-4.4-2-4.4-4.4V4.2z" fill="#fff"/>
  </svg>
);

export const FacebookIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '1em', minHeight: '1em' }}>
    <rect width="24" height="24" rx="5" fill="#1877F2"/>
    <path d="M16.5 12.8h-2.4V20h-3.2v-7.2H9v-2.7h1.9V8.4c0-1.9 1.1-4 4-4l2.9.1v2.6h-2.1c-.3 0-.8.2-.8.9v2h3L16.5 12.8z" fill="#fff"/>
  </svg>
);

export const TwitterIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '1em', minHeight: '1em' }}>
    <rect width="24" height="24" rx="5" fill="#000"/>
    <path d="M14.2 7h2l-4.3 5 5.1 6.7h-4l-3.1-4.1-3.6 4.1H4.8l4.6-5.3L4.5 7h4l2.8 3.7L14.2 7zm-.7 10.5h1.1L9.5 8.2H8.3l5.2 9.3z" fill="#fff"/>
  </svg>
);

export const TelegramIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '1em', minHeight: '1em' }}>
    <rect width="24" height="24" rx="5" fill="#2AABEE"/>
    <path d="M5.5 11.8l11.6-4.5c.5-.2 1 .1.8.9l-2 9.3c-.1.7-.5.8-1.1.5l-3-2.2-1.4 1.4c-.2.2-.3.3-.6.3l.2-3.1 5.6-5c.2-.2-.1-.3-.4-.1L9.4 13l-3-.9c-.6-.2-.7-.6.1-1z" fill="#fff"/>
  </svg>
);

export const AppDownloadIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '1em', minHeight: '1em' }}>
    <rect width="24" height="24" rx="5" fill="#22C55E"/>
    <rect x="8" y="4" width="8" height="16" rx="2" stroke="#fff" strokeWidth="1.5" fill="none"/>
    <line x1="12" y1="9" x2="12" y2="15" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/>
    <polyline points="9.5,13 12,15.5 14.5,13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

export const WebsiteVisitIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ minWidth: '1em', minHeight: '1em' }}>
    <rect width="24" height="24" rx="5" fill="#3B82F6"/>
    <circle cx="12" cy="12" r="6.5" stroke="#fff" strokeWidth="1.5" fill="none"/>
    <ellipse cx="12" cy="12" rx="3" ry="6.5" stroke="#fff" strokeWidth="1.2" fill="none"/>
    <line x1="5.5" y1="12" x2="18.5" y2="12" stroke="#fff" strokeWidth="1.2"/>
  </svg>
);
