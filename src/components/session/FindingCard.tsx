import type { OPMFinding } from "@/types/opm";
import Badge from "@/components/ui/Badge";
import { useExpressionMap } from "@/hooks/useExpressionMap";

interface FindingCardProps {
  finding: OPMFinding;
  referenceImageUrl?: string | null;
}

export default function FindingCard({ finding, referenceImageUrl }: FindingCardProps) {
  const { getImageUrl } = useExpressionMap();
  const resolvedImage = referenceImageUrl ?? getImageUrl(finding.type);
  return (
    <article className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-white/50">{finding.timestamp_start.toFixed(2)}s - {finding.timestamp_end.toFixed(2)}s</div>
        <Badge label={`${Math.round(finding.confidence * 100)}%`} tone="warning" />
      </div>
      <h4 className="mt-2 text-sm font-semibold text-white">{finding.type}</h4>
      <p className="mt-1 text-xs text-white/70">{finding.description}</p>
      {resolvedImage && <img className="mt-3 h-20 w-20 rounded object-cover" src={resolvedImage} alt={finding.type} />}
    </article>
  );
}
