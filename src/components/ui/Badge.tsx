interface BadgeProps {
  label: string;
  tone?: "default" | "success" | "warning" | "danger";
}

const toneClass: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "border-white/20 text-white/80",
  success: "border-emerald-400/40 text-emerald-300",
  warning: "border-amber-400/40 text-amber-300",
  danger: "border-red-400/40 text-red-300",
};

export default function Badge({ label, tone = "default" }: BadgeProps) {
  return <span className={`rounded-full border px-2 py-0.5 text-xs ${toneClass[tone]}`}>{label}</span>;
}
