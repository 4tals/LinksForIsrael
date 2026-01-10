# Netlify Cost Fix Plan

## Problem

SSR (Server-Side Rendering) is causing Netlify function calls on every request, especially from web crawlers. This consumes credits and costs money.

## Current State Analysis

- ✅ `generateStaticParams()` exists in main pages (good foundation)
- ❌ No `output: 'export'` in `next.config.js`
- ❌ No `robots.txt` to control crawlers
- ❌ No cache headers configured
- ❌ No `dynamicParams = false` to prevent fallback SSR

## Fix Plan

### 1. Force Full Static Generation

- [ ] Add `output: 'export'` to `next.config.js`
- [ ] Add `dynamicParams = false` to pages to prevent SSR fallback
- [ ] Remove/adjust any dynamic features incompatible with static export

### 2. Add robots.txt (Crawler Control)

- [ ] Create `public/robots.txt` with crawl-delay and rate limiting

### 3. Cache Headers (Backup if SSR needed)

- [ ] Add cache headers in `next.config.js` for static assets

### 4. Verify & Test

- [ ] Build locally to ensure static export works
- [ ] Check `.next/` or `out/` folder for static HTML files

---

## Implementation Status

| Task                  | Status  | Notes                         |
| --------------------- | ------- | ----------------------------- |
| Static export config  | ✅ Done | `output: 'export'` added      |
| dynamicParams = false | ✅ Done | Both pages updated            |
| robots.txt            | ✅ Done | Blocks AI crawlers, 10s delay |
| Netlify \_redirects   | ✅ Done | Moved from next.config.js     |
| Local build test      | ✅ Done | 196 static pages, no warnings |

## Build Output

```
✓ Generating static pages (196/196)
○ (Static) prerendered as static content
● (SSG) prerendered as static HTML
→ Output folder: /out/
→ _redirects: ✓
→ robots.txt: ✓
```

---

## Risk Assessment

- **Low Risk**: Adding robots.txt
- **Low Risk**: Static export - NO API routes, NO dynamic features found ✅

## Analysis Results

```
✅ No API routes (/app/api/)
✅ No cookies/headers/searchParams usage
✅ generateStaticParams() already in place
✅ Simple static content site
→ IDEAL CANDIDATE FOR FULL STATIC EXPORT
```

## Next Steps

1. ~~Review this plan~~ ✅
2. ~~Implement fixes~~ ✅
3. ~~Test build locally~~ ✅
4. **Deploy to Netlify** ← YOU ARE HERE

## Files Changed

- `next.config.js` - Added static export
- `app/[[...category]]/page.tsx` - Added dynamicParams = false
- `app/docs/[slug]/page.tsx` - Added dynamicParams = false
- `public/robots.txt` - NEW (crawler control)
- `public/_redirects` - NEW (Netlify redirects)
