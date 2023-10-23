"use client";

import mixpanel from "mixpanel-browser";

if (!process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
  throw new Error("Missing NEXT_PUBLIC_MIXPANEL_TOKEN env var");
}

mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
  track_pageview: true,
  persistence: "localStorage",
});
