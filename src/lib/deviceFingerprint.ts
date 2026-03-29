export function generateDeviceFingerprint(): string {
  const components = [
    navigator.userAgent,
    screen.width.toString(),
    screen.height.toString(),
    screen.colorDepth.toString(),
    navigator.language,
    (navigator.hardwareConcurrency || 0).toString(),
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.platform || "",
  ];

  const raw = components.join("|");

  // Simple hash function (djb2)
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash + raw.charCodeAt(i)) >>> 0;
  }
  return hash.toString(16).padStart(8, "0");
}
