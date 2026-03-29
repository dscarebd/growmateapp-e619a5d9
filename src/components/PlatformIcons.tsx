import React from "react";

export const YouTubeIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M43.2 12.3c-.5-1.8-1.9-3.2-3.7-3.7C36.2 7.6 24 7.6 24 7.6s-12.2 0-15.5 1-3.2 1.9-3.7 3.7C3.8 15.6 3.8 24 3.8 24s0 8.4 1 11.7c.5 1.8 1.9 3.2 3.7 3.7C11.8 40.4 24 40.4 24 40.4s12.2 0 15.5-1c1.8-.5 3.2-1.9 3.7-3.7 1-3.3 1-11.7 1-11.7s0-8.4-1-11.7z" fill="#FF0000"/>
    <path d="M19.2 31.2L31.2 24l-12-7.2v14.4z" fill="#FFFFFF"/>
  </svg>
);

export const InstagramIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="ig-radial" cx="30%" cy="107%" r="150%">
        <stop offset="0%" stopColor="#fdf497"/>
        <stop offset="5%" stopColor="#fdf497"/>
        <stop offset="45%" stopColor="#fd5949"/>
        <stop offset="60%" stopColor="#d6249f"/>
        <stop offset="90%" stopColor="#285AEB"/>
      </radialGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#ig-radial)"/>
    <circle cx="24" cy="24" r="9" stroke="#fff" strokeWidth="3.5" fill="none"/>
    <circle cx="35" cy="13" r="2.5" fill="#fff"/>
    <rect x="6" y="6" width="36" height="36" rx="9" stroke="#fff" strokeWidth="3" fill="none"/>
  </svg>
);

export const TikTokIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <path d="M33.5 5.5h-5.8v25.3c0 3.5-2.8 6.3-6.3 6.3s-6.3-2.8-6.3-6.3 2.8-6.3 6.3-6.3c.7 0 1.3.1 1.9.3v-6c-.6-.1-1.3-.1-1.9-.1-6.8 0-12.3 5.5-12.3 12.3S14.6 43.2 21.4 43.2s12.3-5.5 12.3-12.3V18.5c2.5 1.8 5.5 2.8 8.8 2.8v-5.8c-5 0-9-4-9-9v-.5h.1-.1z" fill="#000"/>
    <path d="M33.5 5.5h-5.8v25.3c0 3.5-2.8 6.3-6.3 6.3s-6.3-2.8-6.3-6.3 2.8-6.3 6.3-6.3c.7 0 1.3.1 1.9.3v-6c-.6-.1-1.3-.1-1.9-.1-6.8 0-12.3 5.5-12.3 12.3S14.6 43.2 21.4 43.2s12.3-5.5 12.3-12.3V18.5c2.5 1.8 5.5 2.8 8.8 2.8v-5.8c-5 0-9-4-9-9v-.5z" fill="#25F4EE" transform="translate(-1.5 -1.5)"/>
    <path d="M33.5 5.5h-5.8v25.3c0 3.5-2.8 6.3-6.3 6.3s-6.3-2.8-6.3-6.3 2.8-6.3 6.3-6.3c.7 0 1.3.1 1.9.3v-6c-.6-.1-1.3-.1-1.9-.1-6.8 0-12.3 5.5-12.3 12.3S14.6 43.2 21.4 43.2s12.3-5.5 12.3-12.3V18.5c2.5 1.8 5.5 2.8 8.8 2.8v-5.8c-5 0-9-4-9-9v-.5z" fill="#FE2C55" transform="translate(1.5 1.5)"/>
    <path d="M33.5 5.5h-5.8v25.3c0 3.5-2.8 6.3-6.3 6.3s-6.3-2.8-6.3-6.3 2.8-6.3 6.3-6.3c.7 0 1.3.1 1.9.3v-6c-.6-.1-1.3-.1-1.9-.1-6.8 0-12.3 5.5-12.3 12.3S14.6 43.2 21.4 43.2s12.3-5.5 12.3-12.3V18.5c2.5 1.8 5.5 2.8 8.8 2.8v-5.8c-5 0-9-4-9-9v-.5z" fill="#000"/>
  </svg>
);

export const FacebookIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="#1877F2"/>
    <path d="M33.3 30.9l1.1-7.2h-6.9v-4.7c0-2 1-3.9 4-3.9h3.1V9.1S31.8 8.6 29 8.6c-5.7 0-9.4 3.4-9.4 9.7v5.5h-6.3v7.2h6.3V48h7.8V30.9h5.9z" fill="#fff"/>
  </svg>
);

export const TwitterIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="#000"/>
    <path d="M28.3 14h3.8l-8.3 9.5 9.8 12.9h-7.6l-6-7.8-6.8 7.8H9.3l8.9-10.1L8.9 14h7.8l5.4 7.2L28.3 14zm-1.3 20.2h2.1L18 16.2h-2.3l11.3 18z" fill="#fff"/>
  </svg>
);

export const TelegramIcon = ({ className = "h-6 w-6" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="24" fill="#2AABEE"/>
    <path d="M10.9 23.5l23.1-8.9c1.1-.4 2 .3 1.7 1.9l-3.9 18.6c-.3 1.3-1.1 1.6-2.2 1l-6-4.4-2.9 2.8c-.3.3-.6.6-1.2.6l.4-6.1 11.1-10c.5-.4-.1-.7-.7-.2l-13.7 8.7-5.9-1.8c-1.3-.4-1.3-1.3.3-1.9z" fill="#fff"/>
  </svg>
);
