

## Plan: Add APP Download & Website Visit Platforms + Inline Continue Button

### 1. Update Platform Type (`src/contexts/AppContext.tsx`)
- Extend `Platform` type to include `"app_download" | "website_visit"`

### 2. Add Platform Icons (`src/components/PlatformIcons.tsx`)
- Add `AppDownloadIcon` (smartphone/download icon with green background)
- Add `WebsiteVisitIcon` (globe/link icon with blue background)

### 3. Update Create Campaign (`src/pages/CreateCampaign.tsx`)
- Add `app_download` and `website_visit` to `platformOptions` array with their icons
- Add action sets in `platformActions` for each:
  - **APP Download**: `view` (Download App)
  - **Website Visit**: `view` (Visit Website)
- Import the two new icons and add `Download`, `Globe` from lucide-react for action icons
- **Move Continue button from fixed position to inline** — remove the `fixed bottom-24` wrapper and place the button inside the scrollable `px-5` content area, below the step content (with top margin)

### 4. Update Home Page (`src/pages/Home.tsx`)
- Add the two new platform icons to the `platformIcons` record so tasks/campaigns display correctly

### Files Modified
- `src/contexts/AppContext.tsx` — Platform type union
- `src/components/PlatformIcons.tsx` — 2 new icon components
- `src/pages/CreateCampaign.tsx` — new platforms, actions, inline button
- `src/pages/Home.tsx` — platformIcons record

