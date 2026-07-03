import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
 
// Triggered daily by Vercel Cron (see vercel.json).
// Pulls per-URL Search Analytics data from Google Search Console
// for the last full day and upserts it into gsc_metrics.
//
// Setup required (see README for full steps):
// 1. Create a Google Cloud service account with Search Console API enabled.
// 2. Add that service account as a "Full" or "Restricted" user on your
//    GSC property (Search Console > Settings > Users and permissions).
// 3. Set GSC_CLIENT_EMAIL, GSC_PRIVATE_KEY, GSC_SITE_URL, CRON_SECRET env vars.
 
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
 
  const { google } = await import("googleapis");
 
  const auth = new google.auth.JWT({
    email: process.env.GSC_CLIENT_EMAIL,
    key: process.env.GSC_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
 
  const searchconsole = google.searchconsole({ version: "v1", auth });
 
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const dateStr = yesterday.toISOString().split("T")[0];
 
  const response = await searchconsole.searchanalytics.query({
    siteUrl: process.env.GSC_SITE_URL,
    requestBody: {
      startDate: dateStr,
      endDate: dateStr,
      dimensions: ["page"],
      rowLimit: 5000,
    },
  });
 
  const rows = response.data.rows || [];
  const supabase = createServiceClient();
 
  const records = rows.map((row) => {
    const url = row.keys?.[0] || "";
    const slug = url.replace(process.env.NEXT_PUBLIC_SITE_URL || "", "").replace(/^\/+/, "");
    return {
      slug,
      date: dateStr,
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
    };
  });
 
  if (records.length > 0) {
    await supabase.from("gsc_metrics").upsert(records, { onConflict: "slug,date" });
  }
 
  return NextResponse.json({ synced: records.length, date: dateStr });
}
