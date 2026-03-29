

# Boostly — Social Media Growth Marketplace

## Design System
- **Colors**: Blue & teal palette with soft gradients, calming tones
- **Style**: GoZayaan-inspired — rounded cards, smooth animations, premium feel
- **Layout**: Mobile-first with bottom navigation bar, responsive for web

## Screens & Features

### 1. Splash & Onboarding
- Animated splash screen with Boostly logo
- 3-step onboarding carousel (Earn Credits → Run Campaigns → Grow Fast)
- Skip option

### 2. Auth (Login / Signup)
- Clean login/signup forms with email & password
- Social login buttons (UI only)
- Mock authentication flow

### 3. Home Dashboard
- Credit balance card with animated counter
- Quick action buttons (Earn, Promote, Buy Credits)
- Active campaigns summary
- Recent earnings/activity feed
- "🔥 High Reward" featured tasks preview

### 4. Task Marketplace
- Sortable task list (highest reward first)
- Platform filter tabs (YouTube, Instagram, TikTok, Facebook)
- Task cards showing: platform icon, action type, reward amount, "🔥 High Reward" badge
- Task flow: Click → Redirect timer → Verify → Credits earned animation

### 5. Campaign Creation & Management
- Multi-step campaign form: Platform → Link → Budget → Reward per action
- Auto-calculated estimated reach based on bid
- Campaign list with real-time progress bars
- Campaign status (Active, Paused, Completed)

### 6. Wallet
- Credit balance display
- Transaction history (earned, spent, purchased)
- Buy credits packages (UI only, no Stripe yet)
- Withdrawal request form with commission preview
- Withdrawal status tracking

### 7. Profile & Settings
- User profile with stats (tasks completed, campaigns run, total earned)
- Referral system with shareable invite code
- Settings (notifications, account)

### 8. Admin Panel
- Separate admin layout
- User management table
- Campaign approval queue
- Withdrawal request management with fraud indicators
- Revenue analytics with charts
- Credit pricing controls

### 9. Bottom Navigation
- Home, Tasks, + (Create Campaign), Wallet, Profile
- Active state animations

## Data
- All features use mock data with realistic values
- State management via React context for credits, tasks, campaigns

