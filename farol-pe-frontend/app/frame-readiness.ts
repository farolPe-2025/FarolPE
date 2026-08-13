const POWER_BI_RENDERED_EVENT_PATH = /(?:^|\/)events\/rendered(?:[/?#]|$)/i;
const POWER_BI_EVENT_NAME_KEYS = new Set(["event", "eventname", "name"]);
const POWER_BI_EVENT_PATH_KEYS = new Set(["path", "route", "url"]);
const POWER_BI_EVENT_ENVELOPE_KEYS = new Set([
  "body",
  "data",
  "detail",
  "payload",
  "value",
]);
const MAX_MESSAGE_DEPTH = 8;
const MAX_MESSAGE_NODES = 250;
const MAX_JSON_MESSAGE_LENGTH = 100_000;

function parseJsonMessage(value: string): unknown {
  const trimmed = value.trim();
  if (
    trimmed.length === 0 ||
    trimmed.length > MAX_JSON_MESSAGE_LENGTH ||
    !(
      (trimmed.startsWith("{") && trimmed.endsWith("}")) ||
      (trimmed.startsWith("[") && trimmed.endsWith("]"))
    )
  ) {
    return undefined;
  }

  try {
    return JSON.parse(trimmed) as unknown;
  } catch {
    return undefined;
  }
}

/**
 * Detects the Power BI/Fabric `rendered` signal in both the public event shape
 * and the HTTP-over-postMessage envelope used by the official client SDK.
 */
export function isPowerBiRenderedMessage(data: unknown): boolean {
  const seen = new WeakSet<object>();
  let inspectedNodes = 0;

  const inspect = (value: unknown, keyHint = "", depth = 0): boolean => {
    if (depth > MAX_MESSAGE_DEPTH || inspectedNodes >= MAX_MESSAGE_NODES) {
      return false;
    }

    if (typeof value === "string") {
      const normalized = value.trim();
      const normalizedKey = keyHint.toLowerCase();

      if (
        POWER_BI_EVENT_NAME_KEYS.has(normalizedKey) &&
        normalized.toLowerCase() === "rendered"
      ) {
        return true;
      }
      if (
        (POWER_BI_EVENT_PATH_KEYS.has(normalizedKey) || keyHint === "") &&
        POWER_BI_RENDERED_EVENT_PATH.test(normalized)
      ) {
        return true;
      }

      const parsed = parseJsonMessage(normalized);
      return parsed !== undefined && inspect(parsed, keyHint, depth + 1);
    }

    if (!value || typeof value !== "object") return false;
    if (seen.has(value)) return false;
    seen.add(value);
    inspectedNodes += 1;

    if (Array.isArray(value) && POWER_BI_EVENT_ENVELOPE_KEYS.has(keyHint.toLowerCase())) {
      return value.some((item) => inspect(item, "", depth + 1));
    }
    if (Array.isArray(value)) return false;

    return Object.entries(value as Record<string, unknown>).some(([key, item]) => {
      const normalizedKey = key.toLowerCase();
      if (
        !POWER_BI_EVENT_NAME_KEYS.has(normalizedKey) &&
        !POWER_BI_EVENT_PATH_KEYS.has(normalizedKey) &&
        !POWER_BI_EVENT_ENVELOPE_KEYS.has(normalizedKey)
      ) {
        return false;
      }
      return inspect(item, key, depth + 1);
    });
  };

  return inspect(data);
}

/** Publish-to-web's legacy signal, emitted after the report page opens. */
export function isPowerBiPageLoadedMessage(data: unknown): boolean {
  const message =
    typeof data === "string" ? parseJsonMessage(data) : data;
  if (!message || typeof message !== "object" || Array.isArray(message)) {
    return false;
  }

  const record = message as Record<string, unknown>;
  return (
    typeof record.event === "string" &&
    record.event.toLowerCase() === "reportpageloaded" &&
    (record.error === undefined || record.error === "")
  );
}
