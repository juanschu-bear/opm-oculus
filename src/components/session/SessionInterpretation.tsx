import type { OPMSessionInterpretation } from "@/types/opm";

interface SessionInterpretationProps {
  interpretation: OPMSessionInterpretation;
}

export default function SessionInterpretation({ interpretation }: SessionInterpretationProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white/80 space-y-2">
      <p><strong>Arc:</strong> {interpretation.session_arc}</p>
      <p><strong>Patterns:</strong> {interpretation.recurring_patterns}</p>
      <p><strong>Dynamics:</strong> {interpretation.cross_person_dynamics}</p>
      <p><strong>Insight:</strong> {interpretation.key_insight}</p>
    </div>
  );
}
