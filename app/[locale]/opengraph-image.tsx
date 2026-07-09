import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import type { Locale } from "@/lib/i18n/routing";

export const alt = "elReda Advertising";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function loadTajawalBold(): Promise<ArrayBuffer> {
  const fontBuffer = await readFile(
    join(process.cwd(), "public/fonts/Tajawal-Bold.ttf"),
  );

  return new Uint8Array(fontBuffer).buffer;
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const isArabic = locale === "ar";
  const tajawalBold = await loadTajawalBold();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0A0A0A 0%, #111111 55%, #1A0808 100%)",
          color: "#FFFFFF",
          padding: "72px 80px",
          direction: isArabic ? "rtl" : "ltr",
          fontFamily: "Tajawal",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            <div
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                background: "#B03020",
              }}
            />
            <span>{isArabic ? "إلريدا للدعاية والإعلان" : "elReda Advertising"}</span>
          </div>
          <div style={{ color: "#A0A0A0", fontSize: 24 }}>Cairo, Egypt</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 26, maxWidth: 900 }}>
          <div style={{ color: "#B03020", fontSize: 28, fontWeight: 700 }}>
            {isArabic ? "وكالة إبداعية وتقنية متكاملة" : "Full-Service Creative & Technology Agency"}
          </div>
          <div style={{ fontSize: isArabic ? 68 : 72, fontWeight: 700, lineHeight: 1.08 }}>
            {isArabic
              ? "نبني علامات وأنظمة رقمية تساعد أعمالك على النمو"
              : "Brands, websites, systems, and AI automation under one roof"}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            color: "#A0A0A0",
            fontSize: 24,
          }}
        >
          <span>{isArabic ? "مصر + الخليج" : "Egypt + GCC"}</span>
          <span>elreda.com</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Tajawal",
          data: tajawalBold,
          style: "normal",
          weight: 700,
        },
      ],
    },
  );
}
