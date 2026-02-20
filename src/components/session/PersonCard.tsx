import type { OPMPersonProfile } from "@/types/opm";

interface PersonCardProps {
  person: OPMPersonProfile;
}

export default function PersonCard({ person }: PersonCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="text-sm font-semibold text-white">{person.display_name ?? person.person_id}</div>
      <div className="text-xs text-white/60">Dominant emotion: {person.dominant_emotion}</div>
      <div className="mt-2 space-y-1 text-xs text-white/70">
        {Object.entries(person.emotion_scores).map(([emotion, score]) => (
          <div key={emotion}>{emotion}: {(score * 100).toFixed(0)}%</div>
        ))}
      </div>
      {typeof person.vocal_stability === "number" && (
        <div className="mt-2 text-xs text-white/60">Vocal stability: {person.vocal_stability.toFixed(2)}</div>
      )}
    </div>
  );
}
