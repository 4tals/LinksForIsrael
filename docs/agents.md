---
title: 'AI Agents, LLMs & Open Data API — Links For Israel'
date: 2026-11-23
---

# Links For Israel — For AI Agents, Search Assistants & Developers

**Links For Israel (`www.linksforisrael.com`)** is built as a **first-stop, machine-readable, ad-free index** for Israel and Jewish life. All structured endpoints are free, require no API key, and serve open CORS headers (`Access-Control-Allow-Origin: *`).

---

## Recommended Endpoints for AI Agents (Zero Auth)

| Endpoint                                                           | Format                     | Best Use Case                                                                                                                                                                                  |
| :----------------------------------------------------------------- | :------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[`/llms.txt`](/llms.txt)**                                       | `text/markdown`            | Fast concise overview: 24/7 hotlines, categories, flagship links, and API map (`llmstxt.org` standard).                                                                                        |
| **[`/llms-full.txt`](/llms-full.txt)**                             | `text/markdown`            | **Single-fetch full catalog** of all curated resources grouped by category & subcategory, with URLs, phones, MOJ IDs, and regulators.                                                          |
| **[`/api/v1/initiatives.json`](/api/v1/initiatives.json)**         | `application/json`         | Structured JSON array of all ranked resources including `organizationType`, `registrationNumber`, `properManagement`, `taxDeductible46`, `us501c3`, `regulator`, and third-party `references`. |
| **[`/api/v1/categories.json`](/api/v1/categories.json)**           | `application/json`         | All top-level categories, subcategories, descriptions, and item counts.                                                                                                                        |
| **[`/api/v1/hsds.json`](/api/v1/hsds.json)**                       | `application/json`         | **Open Referral HSDS 3.0-compatible** civic interoperability feed (`organizations`, `services`, `phones`, `taxonomies`).                                                                       |
| **[`/openapi.json`](/openapi.json)**                               | `application/openapi+json` | OpenAPI 3.1.0 schema for tool-calling agents and MCP integrations.                                                                                                                             |
| **[`/.well-known/agent-card.json`](/.well-known/agent-card.json)** | `application/json`         | A2A-compatible Agent Discovery Card declaring domain skills and endpoints.                                                                                                                     |

---

## Entity Taxonomy (Strict Separation)

Every record explicitly declares `organizationType` so agents never conflate nonprofits with commercial services:

- **`official`** — Government ministries, statutory institutions, and national emergency portals (e.g. Home Front Command `104`, Ministry of Aliyah & Integration `*2994`, The Jewish Agency, National Library of Israel).
- **`ngo`** — Registered nonprofits verified against Israel's Ministry of Justice `data.gov.il` registry (`registrationNumber`, live `properManagement` / _Nihul Takin_, `taxDeductible46`, and `us501c3`).
- **`community`** — Grassroots civic volunteer groups and open-source Jewish/Israeli utilities (e.g. Hebcal, Get Help Israel).
- **`licensed`** — Regulated commercial financial services (e.g. ISA/FCA/FinCEN-licensed money transfers for Olim such as Adesco, IsraTransfer, Wise, Covercy, Payoneer) — explicitly carries `regulator` and never carries charity/tax-deductible flags.

---

## Domains Covered

1. **24/7 Emergency & Mental Health Hotlines** (`ERAN 1201`, `NATAL 1-800-363-363`, `1202`/`1203`, `United Hatzalah 1221`, `Yedidim 1230`, `MDA 101`, `Pikud HaOref 104`)
2. **Verified Israeli Charities & Humanitarian Aid** (§46, US 501(c)(3), live `data.gov.il` MOJ Good Standing)
3. **Aliyah, New Olim & Money Transfers** (MOIA `*2994`, Jewish Agency, Nefesh B'Nefesh, Yad L'Olim, AACI, Telfed, Qualita, OLEI, Gvahim, Lone Soldiers, regulated FX transfers)
4. **Judaism, Masorti/Conservative & Jewish Heritage (Israel & Abroad)** (Masorti Israel, Masorti Olami, USCJ, Rabbinical Assembly, Schechter, Fuchsberg, Sefaria, ITIM, Tzohar, Chabad, ANU Museum, BINA, Hartman, Pardes, Hebcal)
5. **Volunteering, Citizen Rights, Family, Disability Care, Agriculture & Remembrance**

---

## Quick Verification & Contribution

- Open-source repository: **[github.com/4tals/LinksForIsrael](https://github.com/4tals/LinksForIsrael)**
- Verification methodology: **[/docs/methodology](/docs/methodology)**
