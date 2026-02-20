export function resolveApiBases(primaryBase: string) {
  const envProxy = (import.meta.env.VITE_API_PROXY_TARGET ?? "").replace(
    /\/$/,
    "",
  );
  const envAsset = (import.meta.env.VITE_API_ASSET_BASE ?? "").replace(
    /\/$/,
    "",
  );
  const normalizedPrimary = primaryBase.replace(/\/$/, "");
  const bases = [normalizedPrimary];
  if (envProxy) bases.push(envProxy);
  if (envAsset && envAsset.startsWith("http")) bases.push(envAsset);
  return Array.from(new Set(bases.filter(Boolean)));
}

export async function fetchJsonFromAny<T>(
  bases: string[],
  path: string,
  init?: RequestInit,
): Promise<{ data: T; base: string }> {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  let lastError = "Request failed";

  for (const base of bases) {
    try {
      const response = await fetch(`${base}${normalizedPath}`, init);
      if (!response.ok) {
        lastError = `${response.status} ${response.statusText}`;
        continue;
      }
      const data = (await response.json()) as T;
      return { data, base };
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Network error";
    }
  }

  throw new Error(lastError);
}
