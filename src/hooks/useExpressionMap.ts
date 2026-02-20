import { useEffect, useState } from "react";

const EXPRESSION_MAP_URL = "https://assets.onioko.com/expression_map.json";
const EXPRESSION_BASE_URL = "https://assets.onioko.com/expressions";

interface FolderEntry {
  label: string;
  category: string;
  action_units: string[];
  description: string;
  images: string[];
  selected_image?: string;
  variant?: "real" | "fake";
}

interface ExpressionMap {
  folders: Record<string, FolderEntry>;
  finding_map: Record<string, string>;
}

export function useExpressionMap() {
  const [map, setMap] = useState<ExpressionMap | null>(null);

  useEffect(() => {
    fetch(EXPRESSION_MAP_URL)
      .then((r) => r.json())
      .then((data) => setMap(data as ExpressionMap))
      .catch(() => console.warn("Failed to load expression map"));
  }, []);

  const getImageUrl = (findingType: string): string | null => {
    if (!map) return null;
    const folder = map.finding_map[findingType];
    if (!folder || !map.folders[folder]) return null;
    const entry = map.folders[folder];
    const image = entry.selected_image || entry.images[0];
    if (!image) return null;
    return `${EXPRESSION_BASE_URL}/${folder}/${image}`;
  };

  return { map, getImageUrl };
}
