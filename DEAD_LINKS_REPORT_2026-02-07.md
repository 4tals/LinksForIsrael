# Dead Links Report - Strategic Communication Category
**Date:** February 7, 2026  
**Reviewed Category:** Strategic Communication (הסברה)

## Summary
Found **6 dead or broken links** in the Strategic Communication category during automated testing.

## Dead Links Found

### 1. BlueWhitePublicity (הסברה כחול לבן)
- **URL:** https://www.hasbaracahollavan.com/
- **Location:** StrategicCommunication/Main/links.json
- **Status:** DNS not resolving (ERR_NAME_NOT_RESOLVED)
- **Recommendation:** Remove initiative or mark as inactive
- **WhatsApp link:** https://chat.whatsapp.com/HYMhYDs0axhITaeR69A8TE (not tested)

### 2. israelfightsback (ישראל נלחמת בחזרה)
- **URL:** http://israelfightsback.info/
- **Location:** StrategicCommunication/SocialNetworks/links.json
- **Status:** DNS not resolving (ENOTFOUND)
- **Recommendation:** Remove initiative
- **LinkedIn link:** Still active (https://www.linkedin.com/feed/update/urn:li:activity:7129593577231310848/)

### 3. Oct7.App (אוקט7 - אפילקצית תגובות)
- **URL:** https://app.oct7.io/
- **Location:** StrategicCommunication/SocialNetworks/links.json
- **Status:** HTTP 404
- **Note:** Main site https://www.oct7.io/ is working
- **Recommendation:** Update URL to https://www.oct7.io/

### 4. ShareItIl (שייר איט ישראל)
- **URL:** https://shareitil.com/
- **Location:** StrategicCommunication/SocialNetworks/links.json
- **Status:** DNS not resolving (ENOTFOUND)
- **Recommendation:** Remove initiative or mark as inactive

### 5. לנצח כל אדיוט בויכוח
- **URL:** https://www.commentron.ai/fuck-hamas
- **Location:** StrategicCommunication/SocialNetworks/links.json
- **Status:** Connection failed
- **Recommendation:** Remove or investigate if service moved
- **Alternative URLs in data:**
  - LinkedIn: https://www.linkedin.com/feed/update/urn:li:activity:7119216100805857280?commentUrn=...
  - YouTube: https://www.youtube.com/watch?v=frUmtcaKnR4

### 6. Block The Hate (בלוק השנאה)
- **URL:** https://www.blockthehateil.com/
- **Location:** StrategicCommunication/SocialNetworks/links.json
- **Status:** DNS not resolving (ENOTFOUND)
- **Recommendation:** Remove initiative or mark as inactive
- **Alternative URLs in data:**
  - WhatsApp: https://chat.whatsapp.com/Ij3IPuMRMT88NbwsCz31Aq
  - Telegram: https://t.me/BlockTheHateIL_Bot

## Notes on Protected Sites
Some sites returned HTTP 403 due to Cloudflare protection (not dead, just protected):
- https://iron-swords.co.il/ - Working but requires CAPTCHA verification
- https://www.wordsofiron.com/en - Working but has protection

## Recommendations
1. Remove initiatives with completely dead domains (no DNS resolution)
2. Update Oct7.App URL to the working main site
3. Consider keeping initiatives that have working alternative contact methods (WhatsApp, Telegram)
4. Document that some sites have Cloudflare protection making automated checking difficult

## Testing Method
- Automated curl testing with 10s connection timeout, 15s max timeout
- Manual verification with web_fetch and browser testing
- Date tested: 2026-02-07
