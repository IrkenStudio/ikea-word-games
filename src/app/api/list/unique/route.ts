import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { join } from "path";
import { readFileSync } from "fs";

import { FALLBACK_LANG, LANGUAGES } from "@/app/i18n/settings";

export async function GET(request: Request) {
  const cookieStore = cookies();
  const locale = cookieStore.get("i18next");
  let lang = locale?.value ?? FALLBACK_LANG;
  if (!LANGUAGES.includes(lang)) {
    lang = FALLBACK_LANG;
  }

  const { searchParams } = new URL(request.url);

  // Default file
  let fileName = "all";

  const mode = searchParams.get("mode");
  const lengthParam = searchParams.get("length");

  if (mode && ["easy", "medium", "hard"].includes(mode)) {
    fileName = mode;
  } else if (lengthParam) {
    try {
      const length = Number(lengthParam);
      // Fix length between 4 and 10
      if (length < 4 || length > 11) {
        fileName = "all";
      } else {
        fileName = length.toString();
      }
    } catch (error) {
      fileName = "all";
    }
  }

  const filepath = join(process.cwd(), "public", "data", lang, "unique", `${fileName}.json`);
  const list = JSON.parse(readFileSync(filepath, { encoding: "utf8" }));

  return NextResponse.json(list);
}
