// Single source of truth for values that were previously typed out by hand
// in multiple places (SocialLinks.vue, SiteFooter.vue, about.md's GitHub
// chart embed) — no behavior change, just removing the duplication.
export const GITHUB_USERNAME = 'joyboy18900'
export const GITHUB_PROFILE_URL = `https://github.com/${GITHUB_USERNAME}`
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_USERNAME}/surakiat.com`
export const LINKEDIN_PROFILE_URL = `https://www.linkedin.com/in/surakiat/`

// Matches vars.css's --accent. Duplicated here (rather than reading the CSS
// custom property) because ghchart.rshah.org needs the hex baked into its
// image URL, not a CSS variable.
export const ACCENT_COLOR = 'ff6500'
