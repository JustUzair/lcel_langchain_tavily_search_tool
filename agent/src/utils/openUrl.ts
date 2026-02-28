import { convert } from "html-to-text";
import { OpenURLOutputSchema } from "./schema.js";

export async function openUrl(url: string) {
  const normalized = validateURL(url);
  const res = await fetch(normalized, {
    headers: {
      "User-Agent": "agent-core/1.0 +(lcel-tool)", // avoid instant 403 on strict websites
    },
  });
  if (!res.ok) {
    const body = await safeText(res);
    throw new Error(
      `OpenURL failed with ${res.status} ${res.statusText} - ${body.slice(0, 200)}`,
    );
  }
  const contentType = res.headers.get("content-type") ?? "";
  const raw = await res.text();
  const text = contentType.includes("text/html")
    ? convert(raw, {
        wordwrap: false,
        selectors: [
          {
            selector: "nav",
            format: "skip",
          },
          {
            selector: "header",
            format: "skip",
          },
          {
            selector: "footer",
            format: "skip",
          },
          {
            selector: "script",
            format: "skip",
          },
          {
            selector: "style",
            format: "skip",
          },
        ],
      })
    : raw;

  const cleaned = collapseWhitespace(text);
  const capped = cleaned.slice(0, 2000);

  return OpenURLOutputSchema.parse({
    url: normalized,
    content: capped,
  });
}

function validateURL(url: string) {
  try {
    const parsed = new URL(url);
    if (!/^https?:$/.test(parsed.protocol)) {
      throw new Error("Only http or https are supported");
    }
    return parsed.toString();
  } catch (err) {
    throw new Error("Invalid URL");
  }
}

async function safeText(res: Response) {
  try {
    return await res.json();
  } catch (e) {
    return "<no response body>";
  }
}

function collapseWhitespace(text: string) {
  return text.replace(/\s+/g, " ").trim();
}
