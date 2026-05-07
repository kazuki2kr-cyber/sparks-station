import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, resolve } from "path";
import { fileURLToPath } from "url";
import { ImageResponse } from "@vercel/og";
import React from "react";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const outDir = join(repoRoot, "tmp");
const outPath = join(outDir, "sparks-reel-overlay-diagnostic.png");

function normalizeForImage(text) {
  return text
    .replace(/[①-⑳]/g, (char) => String(char.charCodeAt(0) - 9311))
    .replace(/[⇒→]/g, "->")
    .replace(/[〜～]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/[・]/g, " ")
    .replace(/[—–]/g, "-");
}

function estimateFontSize(lines, baseFontSize, minFontSize, maxChars) {
  const longest = lines.reduce((max, line) => Math.max(max, Array.from(line).length), 0);
  if (longest <= maxChars) return baseFontSize;
  return Math.max(minFontSize, Math.round(baseFontSize * (maxChars / longest)));
}

function getFontData() {
  const candidates = [
    join(repoRoot, "public/fonts/noto-sans-jp-japanese-700-normal.woff"),
    join(repoRoot, "public/fonts/noto-sans-jp-japanese-700-normal.woff2"),
  ];
  const fontPath = candidates.find((candidate) => existsSync(candidate));
  if (!fontPath) {
    throw new Error(`Font not found. Tried: ${candidates.join(", ")}`);
  }
  const buffer = readFileSync(fontPath);
  return {
    fontPath,
    data: buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
  };
}

async function main() {
  const width = 1080;
  const height = 1920;
  const text = normalizeForImage(process.argv.slice(2).join(" ") || "6ヶ月で\n116億円Exit");
  const lines = text.split(/\n|\\n/).filter(Boolean);
  const fontSize = estimateFontSize(lines, 88, 44, 12);
  const lineHeight = Math.round(fontSize * 1.22);
  const { fontPath, data } = getFontData();
  const e = React.createElement;

  const response = new ImageResponse(
    e(
      "div",
      {
        style: {
          width,
          height,
          display: "flex",
          position: "relative",
          background: "linear-gradient(180deg, #2f74c0 0%, #f6c45e 100%)",
          fontFamily: "SparksNotoSansJP",
        },
      },
      e(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            top: Math.round(height * 0.24) - fontSize,
            width,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: Math.max(0, Math.round(lineHeight - fontSize)),
          },
        },
        ...lines.map((line, index) =>
          e(
            "div",
            {
              key: `${line}-${index}`,
              style: {
                color: "white",
                fontSize,
                fontWeight: 700,
                lineHeight: `${lineHeight}px`,
                textAlign: "center",
                textShadow: "0 5px 14px rgba(0,0,0,0.92), 0 0 4px rgba(0,0,0,0.95)",
                whiteSpace: "pre",
              },
            },
            line
          )
        )
      ),
      e(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            top: height - 178,
            width,
            display: "flex",
            justifyContent: "center",
            color: "white",
            fontFamily: "Arial",
            fontSize: 42,
            fontWeight: 700,
            textShadow: "0 3px 8px rgba(0,0,0,0.85)",
          },
        },
        "SPARKS STATION"
      )
    ),
    {
      width,
      height,
      fonts: [{ name: "SparksNotoSansJP", data, weight: 700, style: "normal" }],
    }
  );

  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
  writeFileSync(outPath, Buffer.from(await response.arrayBuffer()));
  console.log(`overlay diagnostic written: ${outPath}`);
  console.log(`font: ${fontPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
